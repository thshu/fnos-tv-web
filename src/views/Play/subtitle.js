async function parseM3U8(m3u8Url) {
    const res = await fetch(m3u8Url);
    const text = await res.text();

    const baseUrl = m3u8Url.substring(0, m3u8Url.lastIndexOf("/") + 1);
    const lines = text.split('\n');

    const vttUrls = lines.filter(line => line && !line.startsWith('#'))
        .map(line => baseUrl + line);

    return vttUrls;
}




export function createBlobVTTUrl(vttText) {
    const blob = new Blob([vttText], {type: 'text/vtt'});
    return URL.createObjectURL(blob);
}

export async function M3U8SubtitlePlugin(m3u8Url) {
    const vttUrls = await parseM3U8(m3u8Url);
    // const fullVtt = await loadAndConcatVTT(vttUrls);
    // const vttBlobUrl = createBlobVTTUrl(fullVtt);

    return vttUrls;
}
