import Link from "next/link";
import { Users, DollarSign, MessageCircle, Map } from "lucide-react";
import { Eye } from "lucide-react";

const features = [
  {
    id: 1,
    title: "Driver & Fleet Management",
    description: "Click to access driver & fleet management",
    icon: <Users className="text-blue-600 w-6 h-6" />,
    href: "/drivers",
  },
  {
    id: 2,
    title: "Expense Review",
    description: "Click to access expense review",
    icon: <DollarSign className="text-blue-600 w-6 h-6" />,
    href: "/expenses",
  },
  {
    id: 4,
    title: "Driver Chat",
    description: "Click to access driver chat",
    icon: <MessageCircle className="text-blue-600 w-6 h-6" />,
    href: "/chat",
  },
  {
    id: 5,
    title: "Live GPS Fleet Tracker",
    description: "Click to access live gps fleet tracker",
    icon: <Map className="text-blue-600 w-6 h-6" />,
    href: "/gps-tracker",
  },
];

const QuickViewDashboard = () => {
  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="bg-blue-700 text-white p-6 rounded-md mb-6">
        <h2 className="text-2xl font-bold">Your Quick View Dashboard</h2>
        <p className="text-sm text-white/80 mt-1">
          Access your top 5 most-used fleet management features instantly
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => (
          <Link key={feature.id} href={feature.href}>
            <div className="bg-white rounded-md p-4 shadow-sm hover:shadow-md cursor-pointer transition">
              <div className="flex justify-between items-start">
                <div className="bg-blue-100 p-2 rounded-md">{feature.icon}</div>
                <div className="text-gray-500 text-sm flex items-center gap-1">
                  #{feature.id}
                  <Eye size={14} />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-black mt-3">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {feature.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickViewDashboard;
