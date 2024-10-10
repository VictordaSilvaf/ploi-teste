import { FC, ReactNode } from "react";
import {
  BellIcon,
  CogIcon,
  CreditCardIcon,
  KeyIcon,
  SquaresPlusIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";

interface AsideProfileProps {
    children: ReactNode;
}

const AsideProfile: FC<AsideProfileProps> = ({children}) => {
  const subNavigation = [
    { name: "Perfil", href: "/profile/profile-user", icon: UserCircleIcon, current: true },
    { name: "Conta", href: "#", icon: CogIcon, current: false },
    { name: "Senha", href: "/profile/password", icon: KeyIcon, current: false },
    { name: "Notifications", href: "#", icon: BellIcon, current: false },
    { name: "Billing", href: "#", icon: CreditCardIcon, current: false },
    { name: "Integrations", href: "#", icon: SquaresPlusIcon, current: false },
  ];

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-x lg:divide-y-0">
      <aside className="py-6 lg:col-span-3">
        <nav className="space-y-1">
          {subNavigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              aria-current={item.current ? "page" : undefined}
              className={classNames(
                item.current
                  ? "border-teal-500 bg-teal-50 text-teal-700 hover:bg-teal-50 hover:text-teal-700"
                  : "border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900",
                "group flex items-center border-l-4 px-3 py-2 text-sm font-medium"
              )}
            >
              <item.icon
                aria-hidden="true"
                className={classNames(
                  item.current
                    ? "text-teal-500 group-hover:text-teal-500"
                    : "text-gray-400 group-hover:text-gray-500",
                  "-ml-1 mr-3 h-6 w-6 flex-shrink-0"
                )}
              />
              <span className="truncate">{item.name}</span>
            </Link>
          ))}
        </nav>
        <Toaster position="top-right"></Toaster>
      </aside>

      {children}
    </div>
  );
};

export default AsideProfile;
