// [Previous imports stay the same...]

interface BalanceItemProps {
  label: string;
  amount: number;
  currency: string;
  icon: React.ReactNode;
}

const BalanceItem: React.FC<BalanceItemProps> = ({ label, amount, currency, icon }) => (
  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
    <div className="flex items-center space-x-3">
      {icon}
      <div>
        <span className="text-gray-400 text-sm">{label}</span>
        <p className="font-semibold text-white">{amount} {currency}</p>
      </div>
    </div>
  </div>
);

export const CyberpunkQuantumVault: React.FC = () => {
  // [Component implementation stays exactly the same...]
};