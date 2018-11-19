export const iconMap = {
    directory: '/assets/programs/file-explorer/folder-icon.png',
    default: '/assets/file-icons/file-empty.png'
};

export function getIcon (fileType: string): string {
    fileType = fileType.toLowerCase();
    const icon = iconMap[fileType];
    return !!icon ? icon : iconMap['default'];
}
