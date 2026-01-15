import { eq } from "drizzle-orm"
import { db } from "~/server/db"
import { files as filesTable, folders as foldersTable } from "~/server/db/schema"
import DriveContents from "~/app/drive-contents"


export default async function GoogleDriveClone(props: {
    params: Promise<{ folderId: string }>
}) {
    const params = await props.params

    const parsedFolderId = parseInt(params.folderId);
    if (isNaN(parsedFolderId)) {
        return <div>Invalid folder ID</div>
    }

    const folderId = parsedFolderId
    const files = await db.select().from(filesTable).where(eq(filesTable.parent, folderId))
    const folders = await db.select().from(foldersTable).where(eq(foldersTable.parent, folderId))
    
    return <DriveContents files={files} folders={folders} />
}