import { Database as DB } from "@/lib/database.types"

type Translation = DB["public"]["Tables"]["translations"]["Row"]
type Profile = DB["public"]["Tables"]["profiles"]["Row"]

declare global {
    type Database = DB
}