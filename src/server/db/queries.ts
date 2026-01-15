import "server-only"

import { eq } from "drizzle-orm"
import { db } from "~/server/db"
import { files_table as filesTable, folders_table as foldersTable } from "~/server/db/schema"

export const QUERIES = {
    async getAllParentsForFolder(folderId: number) {
        const parents = []
        let currentId: number | null = folderId

        while (currentId !== null) {
            const result = await db.select().from(foldersTable).where(eq(foldersTable.id, currentId))
            const folder = result[0]
            if (folder) {
                parents.unshift(folder)
                currentId = folder.parent
            } else {
                break
            }
        }

        return parents
    },


    getFolders(folderId: number) {
        const foldersPromise = db.select().from(foldersTable).where(eq(foldersTable.parent, folderId))
        return foldersPromise 
    },

    getFiles(folderId: number) {
        const filesPromise = db.select().from(filesTable).where(eq(filesTable.parent, folderId))
        return filesPromise
    },
}




