export function OrSeparator() {
  return (
    <div className="inline-flex h-4 items-center justify-start gap-3.5">
      <div className="h-px shrink grow basis-0 bg-background-2" />
      <div className="text-muted-foreground">or</div>
      <div className="h-px shrink grow basis-0 bg-background-2" />
    </div>
  );
}
