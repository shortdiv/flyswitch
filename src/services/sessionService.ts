import fs from "fs"

export const retrieveMachineSession = async (id: string) => {
  const data = await fs.promises.readFile("./src/data/machines.json", "utf8")
  const jsonified = JSON.parse(data)
  if (jsonified[id] == undefined) {
    throw Error("machine doesn't exist!")
  }
  return jsonified[id].id
}
