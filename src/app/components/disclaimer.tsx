import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';

const Disclaimer = () => {
  return (
    <Card className="mb-8 bg-slate-50">
      <CardContent className="pt-6">
        <Alert className="mb-4">
          <AlertDescription className="text-sm text-muted-foreground">
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Data Source:</span> All data is sourced from{' '}
                <a 
                  href="https://xrpscan.com/balances" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  xrpscan.com/balances
                </a>
              </p>
              
              <p>
                <span className="font-semibold">Coverage:</span> This summary is based on the top 10,000 wallets from XRPScan&apos;s balance list.
              </p>
              
              <p>
                <span className="font-semibold">Unknown Wallet:</span> `Unknown` represents wallets without labels in the database.
              </p>
              
              <p>
                <span className="font-semibold">Completeness:</span> Please note that this summary may not include all wallets associated with each organization.
              </p>
              
              <p>
                <span className="font-semibold">Balance Calculation:</span> Total XRP includes both available and escrowed amounts.
              </p>
              
              <p>
                <span className="font-semibold">Updates:</span> Data is updated once daily at approximately 01:00 UTC.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default Disclaimer;