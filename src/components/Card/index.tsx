import { CardAction } from "./card-action"
import { CardContent } from "./card-content"
import { CardDescription } from "./card-description"
import { CardFooter } from "./card-footer"
import { CardHeader } from "./card-header"
import { CardRoot } from "./card-root"
import { CardTitle } from "./card-title"

export const Card = Object.assign(CardRoot, {
  Root: CardRoot,
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Action: CardAction,
  Content: CardContent,
  Footer: CardFooter,
})
