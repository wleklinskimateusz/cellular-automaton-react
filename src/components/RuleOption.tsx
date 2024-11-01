import { cn } from "@/lib/utils";
import { Card, CardContent, CardTitle, CardHeader } from "./ui/card";

export const RuleOption = ({
  rule,
  image,
  onClick,
  selected,
}: {
  rule: number;
  image: string;
  onClick: () => void;
  selected: boolean;
}) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "cursor-pointer hover:bg-gray-100",
        selected && "bg-gray-200"
      )}
    >
      <CardHeader>
        <CardTitle className="text-center">Rule {rule}</CardTitle>
      </CardHeader>
      <CardContent>
        <img
          className="w-32 h-32 rounded-sm"
          src={image}
          alt={`Rule ${rule}`}
        />
      </CardContent>
    </Card>
  );
};
