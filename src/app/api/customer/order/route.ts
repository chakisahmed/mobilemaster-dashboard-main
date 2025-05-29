import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const payload = await req.json();
        const token = req.headers.get('Authorization');

        if (!token) {
            return NextResponse.json({
                error: 'Missing required header: Authorization'
            }, { status: 400 });
        }


        // Send POST request to external API using axios
        const response = await axios.post('https://www.wamia.tn/rest/V1/carts/mine/payment-information', payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
            },
        });

        // Return a success response with the data from the external API
        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({
            error: 'Failed to create order',
            details: error.message
        }, { status: 500 });
    }
}
export async function GET(req: Request) {
    try {
        // Extract the customer token (ensure it's sent correctly in the request header)
        const token = req.headers.get('Authorization');
        if (!token) {
            return NextResponse.json({ error: 'Authorization token missing' }, { status: 401 });
        }

        // Fetch the customer details to get the customerId
        const customerResponse = await axios.get('http://localhost/rest/V1/customers/me', { 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token, 
            },
        });

        // Extract customerId from response data
        const customerId = customerResponse.data.id;
        if (!customerId) {
            return NextResponse.json({ error: 'Customer ID not found' }, { status: 404 });
        }

        // Define your ORDERS_ACCESS_TOKEN for API integration (ensure it is securely stored and retrieved)
        const ORDERS_ACCESS_TOKEN = process.env.ORDERS_ACCESS_TOKEN;  // Store in environment variable for security

        // Fetch customer orders using the ORDERS_ACCESS_TOKEN and customerId
        const orderResponse = await axios.get(`http://localhost/rest/V1/orders/?searchCriteria[filterGroups][0][filters][0][field]=customer_id&searchCriteria[filterGroups][0][filters][0][value]=${customerId}`, { 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ORDERS_ACCESS_TOKEN}`,  // Ensure proper usage of the API integration token
            },
        });

        // Return a success response with the orders data
        return NextResponse.json(orderResponse.data, { status: 200 });

    } catch (error) {
        // Enhanced error handling for better debugging and feedback
        console.error('Error fetching orders:', error.response ? error.response.data : error.message);
        return NextResponse.json({
            error: 'Failed to retrieve orders',
            details: error.response ? error.response.data : error.message,
        }, { status: 500 });
    }
}