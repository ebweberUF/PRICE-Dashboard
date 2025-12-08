"use client";

const FullLogo = () => {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg">P</span>
      </div>
      <div>
        <span className="text-lg font-bold text-charcoal dark:text-white">PRICE</span>
        <span className="text-xs block text-bodytext dark:text-darklink -mt-1">Dashboard</span>
      </div>
    </div>
  );
};

export default FullLogo;
