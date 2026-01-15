import { eq } from "drizzle-orm"
import { db } from "~/server/db"
import { files as filesTable, folders as foldersTable } from "~/server/db/schema"
import DriveContents from "~/app/drive-contents"

async function getAllParents(folderId: number) {
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
}

export default async function GoogleDriveClone(props: {
    params: Promise<{ folderId: string }>
}) {
    const params = await props.params

    const parsedFolderId = parseInt(params.folderId);
    if (isNaN(parsedFolderId)) {
        return <div>Invalid folder ID</div>
    }

    const folderId = parsedFolderId
    const filesPromise = db.select().from(filesTable).where(eq(filesTable.parent, folderId))
    const foldersPromise = db.select().from(foldersTable).where(eq(foldersTable.parent, folderId))
    const parentsPromise = getAllParents(folderId)

    const [files, folders, parents] = await Promise.all([filesPromise, foldersPromise, parentsPromise])

    return <DriveContents files={files} folders={folders} parents={parents} />
}