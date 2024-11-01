import { cn } from "@/lib/utils";
import { RuleOption } from "./RuleOption";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { rules } from "@/data/rules";

export const RulesOptions = ({
  onChangeRule,
  rule,
}: {
  onChangeRule: (rule: number) => void;
  rule: number;
}) => {
  return (
    <div className="flex flex-row justify-center items-center gap-4 flex-wrap">
      {rules.map(({ image = "", value }) => (
        <RuleOption
          key={value}
          rule={value}
          image={image}
          onClick={() => onChangeRule(value)}
          selected={rule === value}
        />
      ))}
      <Card
        className={cn(
          !Object.values(rules)
            .map(({ value }) => value)
            .includes(rule) && "bg-gray-200"
        )}
      >
        <CardHeader>
          <CardTitle className="text-center">Custom rule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32">
            <Input
              className="bg-white w-32"
              type="number"
              min={0}
              max={255}
              onChange={(e) => onChangeRule(parseInt(e.target.value))}
              value={rule.toString()}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
