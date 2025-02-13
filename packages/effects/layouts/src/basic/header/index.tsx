import { ThemeToggle } from '../../widgets/theme-toggle/ThemeToggle';

function Header() {
  return (
    <div className="flex-center text-muted-foreground relative h-full w-full text-xs">
      <ThemeToggle className="mr-1" />
    </div>
  );
}

export default Header;
