"use client";


import { Card, CardContent } from "@/components/ui/card";
import { IconAccessPoint, IconAward, IconPercentage, IconTarget } from '@tabler/icons-react';;
import { IoWalletOutline } from 'react-icons/io5';

const stats = [
  { label: "Total Bets", value: "3", icon: "target", color: "blue" },
  { label: "IconWallet Balance", value: "$1,659", icon: "trophy", color: "amber" },
  { label: "Today's Earnings", value: "+$0", icon: "Activity", color: "green" },
  { label: "Rank", value: "#2", icon: "medal", color: "purple" },
  { label: "Win Rate", value: "0%", icon: "percent", color: "orange" },
];

const getIcon = (iconName: string, colorClass: string) => {
  const iconProps = { className: `h-6 w-6 ${colorClass}` };

  switch (iconName) {
    case "target":
      return <IconTarget {...iconProps} />;
    case "trophy":
      return <IconAward {...iconProps} />;
    case "Activity":
      return <IconAccessPoint {...iconProps} />;
    case "medal":
      return <IconAward {...iconProps} />;
    case "percent":
      return <IconPercentage {...iconProps} />;
    default:
      return <IconTarget {...iconProps} />;
  }
};

const getColorClasses = (color: string) => {
  const colorMap: Record<
    string,
    { bg: string; blur: string; text: string; icon: string }
  > = {
    blue: {
      bg: "from-blue-50 via-white to-white",
      blur: "bg-blue-100/50 group-hover:bg-blue-200/50",
      text: "text-blue-900",
      icon: "text-blue-600",
    },
    amber: {
      bg: "from-amber-50 via-white to-white",
      blur: "bg-amber-100/50 group-hover:bg-amber-200/50",
      text: "text-amber-900",
      icon: "text-amber-600",
    },
    green: {
      bg: "from-green-50 via-white to-white",
      blur: "bg-green-100/50 group-hover:bg-green-200/50",
      text: "text-green-900",
      icon: "text-green-600",
    },
    purple: {
      bg: "from-purple-50 via-white to-white",
      blur: "bg-purple-100/50 group-hover:bg-purple-200/50",
      text: "text-purple-900",
      icon: "text-purple-600",
    },
    orange: {
      bg: "from-orange-50 via-white to-white",
      blur: "bg-orange-100/50 group-hover:bg-orange-200/50",
      text: "text-orange-900",
      icon: "text-orange-600",
    },
  };

  return colorMap[color] || colorMap.blue;
};

export function StatsRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      {stats.map((stat) => {
        const colors = getColorClasses(stat.color);

        return (
          <Card
            key={stat.label}
            className={`relative overflow-hidden border-none bg-linear-to-br ${colors.bg} shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group`}
          >
            <div
              className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${colors.blur} blur-2xl transition-all`}
            />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${colors.text}/60`}>
                    {stat.label}
                  </p>
                  <p
                    className={`mt-2 text-3xl font-medium numeric ${colors.text}`}
                  >
                    {stat.value}
                  </p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  {getIcon(stat.icon, colors.icon)}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
