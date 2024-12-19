"use client";

import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';

const SlimDisclaimer = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Card className="mb-2 bg-slate-50">
      <CardContent className="pt-0">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
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

                <CollapsibleContent>
                  <div className="space-y-2">
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
                </CollapsibleContent>

                <div className="flex justify-end mt-2">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 h-auto">
                      <span className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                        {isOpen ? (
                          <>Show less <ChevronUp className="h-4 w-4" /></>
                        ) : (
                          <>Read more <ChevronDown className="h-4 w-4" /></>
                        )}
                      </span>
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default SlimDisclaimer;