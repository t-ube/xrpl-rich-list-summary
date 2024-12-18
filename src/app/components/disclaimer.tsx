import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';

const Disclaimer = () => {
  return (
    <Card className="mb-8 bg-slate-50">
      <CardContent className="pt-0">
        <Alert className="mb-0">
          <AlertDescription className="text-sm text-muted-foreground">
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Data Source:</span> Data is retrieved through{' '}
                <a 
                  href="https://xrpscan.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  xrpscan.com
                </a>
                <span> and XRPL APIs and </span>
                <a 
                  href="https://data.xrplf.org/docs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  XRPL Data API
                </a>
                <span>.</span>
              </p>
              <p>
                <span className="font-semibold">Coverage:</span>
                <span> Analysis covers Well-known accounts and {' '}
                  <a 
                    href="https://xrpscan.com/balances" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    XRP rich list accounts
                  </a>
                  .
                </span>
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
                <span className="font-semibold">Updates:</span> Data is updated hourly.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default Disclaimer;