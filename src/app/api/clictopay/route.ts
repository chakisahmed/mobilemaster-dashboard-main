import { ClictoPayApi } from "@/utils/clicToPayApi";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        // Extract the customer token (ensure it's sent correctly in the request header)
       
        const userName = process.env.CLICTOPAY_USER ?? "";  
        const password = process.env.CLICTOPAY_PASSWORD?? "";  
        const currency = process.env.currency?? "";
        const returnUrl = process.env.returnUrl?? "";

        const credentials = {
            userName,
            password
        }
        console.log('credentials', credentials);
        const clictoPay = new ClictoPayApi(credentials);
        const url = new URL(req.url);
        const orderNumber = url.searchParams.get('orderNumber') ?? ""; // Extract the order ID from the query parameters
        const amount = Number(url.searchParams.get('amount') ?? 0); // Extract the amount from the query parameters
        const language = url.searchParams.get('language') ?? ""; // Extract the language from the query parameters
        
        
        const response = await clictoPay.registerPayment({
            amount,
            currency,
            language,
            returnUrl,//payment.html
            //pageView: 'MOBILE',
            orderNumber
        });
        console.log('register payment ', response);
        

        // Return a success response with the orders data
        return NextResponse.json(response, { status: 200 });

    } catch (error: unknown) {
        // Enhanced error handling for better debugging and feedback
        const err = error as any; // Type assertion to access properties
        console.error('Error fetching orders:', err.response ? err.response.data : err.message);
        return NextResponse.json({
            error: 'Failed to retrieve orders',
            details: err.response ? err.response.data : err.message,
        }, { status: 500 });
    }
}