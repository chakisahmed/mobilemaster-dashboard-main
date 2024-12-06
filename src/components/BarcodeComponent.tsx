import React from 'react';
import Barcode from 'react-barcode';

interface BarcodeComponentProps {
  value: string;
}

const BarcodeComponent: React.FC<BarcodeComponentProps> = ({ value }) => {
  return <Barcode value={value} />;
};

export default BarcodeComponent;