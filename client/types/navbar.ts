interface NavItem {
  label: string;
  href: string;
}

export interface NavbarProps {
  brand?: string;
  items?: NavItem[];
}
