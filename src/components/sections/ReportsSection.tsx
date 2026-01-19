import { Reports } from '../Reports';
import { Transaction } from '../../App';

interface ReportsSectionProps {
  transactions: Transaction[];
  accessToken: string;
}

export function ReportsSection({ transactions, accessToken }: ReportsSectionProps) {
  return (
    <div className="space-y-6">
      <Reports 
        transactions={transactions}
        accessToken={accessToken}
      />
    </div>
  );
}
