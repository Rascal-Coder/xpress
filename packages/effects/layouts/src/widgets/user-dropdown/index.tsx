import { XpressAvatar } from '@xpress-core/shadcn-ui';

export function UserDropdown() {
  return (
    <>
      <div className="hover:bg-accent ml-1 mr-2 cursor-pointer rounded-full p-1.5">
        <div className="hover:text-accent-foreground flex-center">
          <XpressAvatar
            className="size-8"
            dot
            src="https://unpkg.com/@vbenjs/static-source@0.1.7/source/avatar-v1.webp"
          />
        </div>
      </div>
    </>
  );
}
