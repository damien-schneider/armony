export function OrSeparator() {
  return (
    <div className="h-4 justify-start items-center gap-3.5 inline-flex">
      <div className="grow shrink basis-0 h-px bg-background-2" />
      <div className="text-muted-foreground">or</div>
      <div className="grow shrink basis-0 h-px bg-background-2" />
    </div>
  );
}
