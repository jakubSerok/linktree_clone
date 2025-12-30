"use server"
import { db } from "@/lib/db"

export async function addLink(title: string, url: string, userId: string) {
    try {
        if (!title?.trim() || !url?.trim()) {
            return { error: "Title and URL are required" };
        }

        try {
            new URL(url);
        } catch {
            return { error: "Please enter a valid URL" };
        }

        const link = await db.link.create({
            data: {
                title: title.trim(),
                url: url.trim(),
                userId
            }
        });

        return { success: "Link added successfully!", data: link };
    } catch (error) {
        console.error('Add error:', error);
        return { error: "Failed to add link. Please try again." };
    }
}

export async function deleteLink(id: string, userId: string) {
    try {
        const link = await db.link.findUnique({
            where: { id }
        });

        if (!link) {
            return { error: "Link not found" };
        }

        if (link.userId !== userId) {
            return { error: "Unauthorized" };
        }

        await db.link.delete({ where: { id } });
        return { success: "Link deleted successfully!" };
    } catch (error) {
        console.error('Delete error:', error);
        return { error: "Failed to delete link. Please try again." };
    }
}

export async function updateLink(
    id: string,
    title?: string,
    url?: string,
    userId?: string
) {
    try {
        if (!userId) {
            return { error: "Unauthorized" };
        }

        const existingLink = await db.link.findUnique({
            where: { id }
        });

        if (!existingLink) {
            return { error: "Link not found" };
        }

        if (existingLink.userId !== userId) {
            return { error: "Unauthorized" };
        }

        const updateData: { title?: string; url?: string } = {};
        
        if (title !== undefined) {
            updateData.title = title.trim();
        }
        
        if (url !== undefined) {
            try {
                new URL(url); 
                updateData.url = url.trim();
            } catch {
                return { error: "Please enter a valid URL" };
            }
        }

        if (Object.keys(updateData).length === 0) {
            return { error: "No valid fields to update" };
        }

        const updatedLink = await db.link.update({
            where: { id },
            data: updateData
        });

        return { 
            success: "Link updated successfully!",
            data: updatedLink
        };
    } catch (error) {
        console.error('Update error:', error);
        return { error: "Failed to update link. Please try again." };
    }
}