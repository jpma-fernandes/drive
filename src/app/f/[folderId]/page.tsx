import DriveContents from "~/app/drive-contents"
import { getFiles, getFolders, getAllParentsForFolder } from "~/server/db/queries"

export default async function GoogleDriveClone(props: {
    params: Promise<{ folderId: string }>
}) {
    const params = await props.params

    const parsedFolderId = parseInt(params.folderId);
    if (isNaN(parsedFolderId)) {
        return <div>Invalid folder ID</div>
    }

    const folderId = parsedFolderId

    const [files, folders, parents] = await Promise.all([getFiles(folderId), getFolders(folderId), getAllParentsForFolder(folderId)])

    return <DriveContents files={files} folders={folders} parents={parents} />
}