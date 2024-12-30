function Footer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-center text-muted-foreground relative h-full w-full text-xs">
      {children}
    </div>
  );
}

export default Footer;
