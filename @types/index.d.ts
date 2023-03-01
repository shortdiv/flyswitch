//enums are terrible
type Rest = "GET" | "POST" | "DELETE"

declare interface config {
  name: string,
  image: string
}

declare interface machineQuery {
  method?: Rest,
  machineID: string,
  config?: config
}
