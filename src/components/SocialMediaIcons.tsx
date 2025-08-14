import SocialLink from './SocialLinks';
import { cn } from '../lib/utils';
import { NavLink } from 'react-router-dom';

interface Props { 
  className?: string
  iconClassName?: string
  tooltipClassName?: string
}

const SocialMediaIcons = ({className, iconClassName}: Props) => {
  return (
    <div
      className={cn("flex items-center gap-2 translate-y-[20%] ", className)}
    >
      {SocialLink?.map((item) => (
        <NavLink
          to={item?.link}
          key={item?.title}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "text-amber-300 p-2 border border-slate-400  rounded-full",
            iconClassName
          )}
        >
          {item?.icon}
        </NavLink>
      ))}
    </div>
  );
}

export default SocialMediaIcons