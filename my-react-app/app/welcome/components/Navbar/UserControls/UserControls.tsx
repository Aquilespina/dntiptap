import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faCircleUser, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";

interface UserControlsProps {
  showHomeButton?: boolean;
  showUserDropdown?: boolean;
  logoutRoute?: string;
  homeButton?: {
    iconColor?: string;
    variant?: 'flat' | 'solid' | 'light' | 'shadow' | 'bordered' | 'faded';
    className?: string;
  };


  userDropdown?: {
    iconColor?: string;
    variant?: 'flat' | 'solid' | 'light' | 'shadow' | 'bordered' | 'faded';
    className?: string;
  };
}

export const UserControls = ({
  showHomeButton = true,
  showUserDropdown = true,
  logoutRoute = "caronte.logout",
  homeButton = {
    iconColor: 'primary',
    variant: 'flat',
    className: ''
  },
  userDropdown = {
    iconColor: 'primary',
    variant: 'flat',
    className: ''
  }
}: UserControlsProps) => {
  return (
    <div className="flex justify-between items-center gap-4 pr-6">
      {showHomeButton && (
        <Button
          isIconOnly
          radius="full"
          variant={homeButton.variant}
          className={homeButton.className}
        >
          <FontAwesomeIcon
            icon={faHouse}
            size="2xl"
            className={`text-${homeButton.iconColor}`}
          />
        </Button>
      )}

      {showUserDropdown && (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <FontAwesomeIcon
              icon={faCircleUser}
              className={`text-${userDropdown.iconColor} ${userDropdown.className}`}
              size="2xl"
            />
          </DropdownTrigger>
          <DropdownMenu
            aria-label="User Menu"
            variant={userDropdown.variant}
          >
            <DropdownItem key="logout">
              <form
                method="GET"
                action={route(logoutRoute)}
                className="w-full"
              >
                <button
                  type="submit"
                  className="flex gap-1 items-center w-full"
                >
                  <FontAwesomeIcon
                    icon={faArrowRightFromBracket}
                    size="lg"
                    className="mr-2"
                  />
                  Cerrar sesión
                </button>
              </form>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
    </div>
  );
};
