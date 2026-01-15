import { db } from "~/server/db"
import { mockFiles, mockFolders } from "~/lib/mock-data"
import { files, folders } from "~/server/db/schema";

export default function Sandbox() {
    return (
        <div className="flex flex-col gap-4">
            Seed Function
            <form action={async () => {
                "use server";
                console.log("Seeding");

                const folderInsert = await db.insert(folders).values(
                    mockFolders.map((folder, index) => ({
                        id: index+1,
                        name: folder.name,
                        parent: index !== 0 ? 1 : null,
                    })),
                );

                const fileInsert = await db.insert(files).values(
                    mockFiles.map((file, index) => ({
                        id: index+1,
                        name: file.name,
                        url: file.url,
                        parent: (index + 1 % 3) + 1,
                        size: 50000,
                    }))
                );

                console.log("Folder Insert", folderInsert);
                console.log("File Insert", fileInsert);
            }}>
                <button type="submit">Seed</button>
            </form>
        </div>
    );
}