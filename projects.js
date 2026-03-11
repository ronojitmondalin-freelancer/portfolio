document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('projects-container');
    const loading = document.getElementById('loading-indicator');
    
    // We will check for videos from project1.mp4 down to project20.mp4 (can increase if needed)
    const MAX_VIDEOS_TO_CHECK = 100;
    const foundVideos = [];

    // Function to silently check if a file exists
    async function checkVideoExists(index) {
        const url = `project_videos/project${index}.mp4`;
        try {
            const response = await fetch(url, { method: 'HEAD' });
            if (response.ok) {
                return { id: index, url: url };
            }
        } catch (error) {
            // Ignore fetch errors (like 404s)
        }
        return null;
    }

    // Check all potential videos in parallel for speed
    const checks = [];
    for (let i = 1; i <= MAX_VIDEOS_TO_CHECK; i++) {
        checks.push(checkVideoExists(i));
    }

    // Due to checking 100 items, we might want to wait for all
    const results = await Promise.all(checks);
    
    // Filter out nulls and sort by ID (or reverse if we want newest first)
    results.forEach(result => {
        if (result) foundVideos.push(result);
    });

    // Remove loading indicator
    if (loading) {
        loading.remove();
    }

    if (foundVideos.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--card-bg); border-radius: var(--radius-card); border: var(--border-subtle);">
                <i class="ph ph-video" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                <h3>No videos found</h3>
                <p class="text-muted" style="margin-top: 0.5rem;">Add some <code>.mp4</code> files to the <code>project_videos</code> folder, named like <code>project1.mp4</code>, <code>project2.mp4</code>, etc.</p>
            </div>
        `;
        return;
    }

    // Render videos natively without external libraries
    foundVideos.forEach(video => {
        const card = document.createElement('div');
        card.className = 'project-video-card reveal visible';
        
        card.innerHTML = `
            <div class="project-video-container">
                <video class="project-video" autoplay loop muted playsinline>
                    <source src="${video.url}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>
            <div class="project-info">
                <h3 class="project-title">Project ${video.id}</h3>
                <p class="text-muted" style="font-size: 0.85rem;">Auto-configured demo video</p>
            </div>
        `;
        
        container.appendChild(card);
    });
});
