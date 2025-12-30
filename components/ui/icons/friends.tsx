import * as React from "react";

export function FriendsIcon({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  className,
  ...props
}: React.SVGProps<SVGSVGElement> & {
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* 左边小人的头 */}
      <circle cx="6" cy="6" r="3" />
      {/* 右边小人的头 */}
      <circle cx="18" cy="6" r="3" />
      {/* 左边小人的身体和手臂 */}
      <path d="M4 21v-6a2 2 0 0 1 2-2h2l4 2" />
      {/* 右边小人的身体和手臂 */}
      <path d="M20 21v-6a2 2 0 0 0-2-2h-2l-4 2" />
      {/* 牵手处的细节（可选，加个小心心或者简单的握手线条） */}
      {/* 这里简单的线条相交已经表示牵手了，如果需要更亲密，可以在中间加个爱心 */}
      <path d="M12 15l0 0" /> {/* 占位，确保路径闭合感 */}
    </svg>
  );
}
