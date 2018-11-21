export const iconMap = {
    directory: '/assets/programs/file-explorer/folder-icon.png',
    default: '/assets/file-icons/file-empty.png'
};

export function getIcon (fileType: string, defaultPrograms: any = null): string {
    fileType = fileType.toLowerCase();
    let icon = iconMap[fileType];

    // if the icon doesn't have an icon in the icons map, try to use a defeault program
    if (defaultPrograms != null && (!icon && defaultPrograms[fileType])) {
        icon = defaultPrograms[fileType].icon;
    } else if (!icon) {
        icon = iconMap['default'];
    }
    return icon;
}
