import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const title = "Avatar";

const Example = () => (
  <Avatar className="rounded-lg">
    <AvatarImage
      alt="@dovazencot"
      src="https://github.com/dovazencot.png"
    />
    <AvatarFallback className="rounded-lg">DA</AvatarFallback>
  </Avatar>
);

export default Example;
