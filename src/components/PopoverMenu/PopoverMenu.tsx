import { Placement } from '../Popover/Popover';
import Link from '../Link';
import Popover from '../Popover';

type PopoverMenuProps = {
  anchorEl: HTMLElement | null;
  setAnchorEl: (el: HTMLElement | null) => void;
  items: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  }[];
  placement?: Placement
};

export default function PopoverMenu({ anchorEl, setAnchorEl, items, placement = 'bottom' }: PopoverMenuProps) {
  // const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <Popover anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)} className="bg-black/50 backdrop-blur-md rounded-xl border-thin border-black/20 py-1 shadow-xl" placement={placement}>
      <div className="flex flex-col" onClick={(e) => setAnchorEl(null)}>
        {items.map((item) => (
          <MenuItem key={item.label} {...item} className="h-8 flex items-center gap-1.5 pl-3 pr-4 text-white hover:bg-white/10 cursor-pointer">
            {item.icon}
            <span className="text-sm font-medium pr-2">{item.label}</span>
          </MenuItem>
        ))}
      </div>
    </Popover>
  );
}

function MenuItem({ children, onClick, href, download, target, className }: { children: React.ReactNode, onClick?: () => void, href?: string, download?: boolean, target?: string, className?: string }) {
  if (href) {
    return <Link href={href} target={target} download={download} className={className} disableHover>{children}</Link>;
  }

  return <div className={className} onClick={onClick}>{children}</div>;
}
