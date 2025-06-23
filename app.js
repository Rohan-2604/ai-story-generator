// AI Story Generator Application Logic

class StoryGenerator {
    constructor() {
        this.storyElements = {
            fantasy: {
                characters: ["wizard", "knight", "dragon", "princess", "elf", "dwarf", "sorcerer", "fairy"],
                settings: ["enchanted forest", "ancient castle", "magical kingdom", "hidden realm", "crystal cave", "floating city"],
                conflicts: ["evil curse", "dark prophecy", "stolen artifact", "forbidden love", "ancient war", "mystical quest"],
                plotDevices: ["magical sword", "ancient spell", "prophecy scroll", "enchanted mirror", "portal", "talking animal"]
            },
            scifi: {
                characters: ["space explorer", "alien diplomat", "AI scientist", "rebel pilot", "cyborg", "time traveler"],
                settings: ["distant planet", "space station", "futuristic city", "alien world", "laboratory", "spaceship"],
                conflicts: ["alien invasion", "time paradox", "robot uprising", "galactic war", "scientific experiment", "exploration mission"],
                plotDevices: ["advanced technology", "time machine", "alien artifact", "quantum device", "hologram", "neural implant"]
            },
            mystery: {
                characters: ["detective", "suspect", "witness", "victim", "investigator", "criminal"],
                settings: ["crime scene", "dark alley", "old mansion", "police station", "courthouse", "abandoned building"],
                conflicts: ["unsolved murder", "missing person", "stolen treasure", "corporate conspiracy", "family secret", "cold case"],
                plotDevices: ["hidden clue", "secret message", "mysterious letter", "surveillance footage", "DNA evidence", "witness testimony"]
            },
            romance: {
                characters: ["lover", "partner", "rival", "friend", "parent", "matchmaker"],
                settings: ["coffee shop", "small town", "wedding venue", "bookstore", "beach", "city apartment"],
                conflicts: ["misunderstanding", "long distance", "family disapproval", "past relationship", "career choice", "secret identity"],
                plotDevices: ["love letter", "chance encounter", "shared memory", "mutual friend", "romantic gesture", "confession"]
            },
            adventure: {
                characters: ["explorer", "guide", "companion", "rival", "native", "treasure hunter"],
                settings: ["jungle", "mountain peak", "lost city", "desert", "ocean", "cave system"],
                conflicts: ["dangerous journey", "natural disaster", "hostile environment", "competing expedition", "survival challenge", "rescue mission"],
                plotDevices: ["treasure map", "survival gear", "ancient artifact", "rescue signal", "hidden passage", "dangerous wildlife"]
            },
            horror: {
                characters: ["victim", "survivor", "monster", "investigator", "local", "skeptic"],
                settings: ["haunted house", "dark forest", "abandoned hospital", "cemetery", "isolated cabin", "old church"],
                conflicts: ["supernatural threat", "psychological terror", "trapped situation", "ancient evil", "possession", "curse"],
                plotDevices: ["mysterious sound", "hidden truth", "family history", "ritual object", "warning sign", "escape route"]
            },
            comedy: {
                characters: ["comedian", "straight man", "eccentric", "authority figure", "sidekick", "rival"],
                settings: ["workplace", "family gathering", "public place", "small town", "school", "restaurant"],
                conflicts: ["misunderstanding", "awkward situation", "mistaken identity", "competition", "embarrassing secret", "cultural clash"],
                plotDevices: ["running gag", "mistaken assumption", "perfect timing", "unexpected twist", "character flaw", "ironic situation"]
            },
            drama: {
                characters: ["protagonist", "family member", "friend", "colleague", "authority figure", "stranger"],
                settings: ["family home", "workplace", "hospital", "courtroom", "school", "community center"],
                conflicts: ["personal struggle", "family crisis", "moral dilemma", "relationship issues", "career challenge", "life change"],
                plotDevices: ["revelation", "difficult choice", "emotional confrontation", "life lesson", "personal growth", "resolution"]
            }
        };

        this.writingStyles = {
            descriptive: "rich, detailed descriptions with sensory elements",
            "dialogue-heavy": "character interactions and conversations drive the narrative",
            "action-packed": "fast-paced scenes with dynamic events and movement",
            atmospheric: "mood and setting create the story's emotional tone",
            humorous: "light-hearted tone with wit and comedic elements"
        };

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Character counter
        const promptInput = document.getElementById('story-prompt');
        const charCount = document.getElementById('char-count');
        const charCounter = document.querySelector('.character-counter');

        promptInput.addEventListener('input', () => {
            const count = promptInput.value.length;
            charCount.textContent = count;
            
            charCounter.classList.remove('warning', 'error');
            if (count > 400) {
                charCounter.classList.add('warning');
            }
            if (count >= 500) {
                charCounter.classList.add('error');
            }
        });

        // Example prompts
        const examplePrompts = document.querySelectorAll('.example-prompt');
        examplePrompts.forEach(prompt => {
            prompt.addEventListener('click', () => {
                promptInput.value = prompt.dataset.prompt;
                promptInput.dispatchEvent(new Event('input'));
                promptInput.focus();
            });
        });

        // Generate button
        const generateBtn = document.getElementById('generate-btn');
        generateBtn.addEventListener('click', () => {
            this.generateStory();
        });

        // Keyboard shortcut (Enter while focused on prompt)
        promptInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.generateStory();
            }
        });

        // Output action buttons
        document.getElementById('copy-btn').addEventListener('click', () => {
            this.copyStory();
        });

        document.getElementById('save-btn').addEventListener('click', () => {
            this.saveStory();
        });

        document.getElementById('generate-another-btn').addEventListener('click', () => {
            this.generateStory();
        });
    }

    async generateStory() {
        const prompt = document.getElementById('story-prompt').value.trim();
        const genre = document.getElementById('genre-select').value;
        const length = document.getElementById('length-select').value;
        const style = document.getElementById('style-select').value;

        // Validation
        if (!prompt) {
            alert('Please enter a story prompt first!');
            document.getElementById('story-prompt').focus();
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

            // Generate the story
            const story = this.createStory(prompt, genre, length, style);
            
            // Display the story
            this.displayStory(story);
            
        } catch (error) {
            console.error('Error generating story:', error);
            alert('Sorry, there was an error generating your story. Please try again.');
        } finally {
            this.setLoadingState(false);
        }
    }

    setLoadingState(isLoading) {
        const generateBtn = document.getElementById('generate-btn');
        const btnText = generateBtn.querySelector('.btn-text');
        const spinner = generateBtn.querySelector('.loading-spinner');

        if (isLoading) {
            generateBtn.disabled = true;
            btnText.textContent = 'Generating...';
            spinner.classList.remove('hidden');
        } else {
            generateBtn.disabled = false;
            btnText.textContent = 'Generate Story';
            spinner.classList.add('hidden');
        }
    }

    createStory(prompt, genre, length, style) {
        const elements = this.storyElements[genre] || this.storyElements.drama;
        const wordTargets = {
            short: { min: 100, max: 200 },
            medium: { min: 300, max: 500 },
            long: { min: 600, max: 800 }
        };

        // Extract keywords from prompt for contextualization
        const keywords = this.extractKeywords(prompt.toLowerCase());
        
        // Select appropriate elements
        const character = this.selectElement(elements.characters);
        const setting = this.selectElement(elements.settings);
        const conflict = this.selectElement(elements.conflicts);
        const plotDevice = this.selectElement(elements.plotDevices);

        // Generate story structure based on length
        const target = wordTargets[length];
        let story = '';

        // Beginning
        story += this.generateBeginning(prompt, character, setting, style, keywords);
        
        // Middle (conflict development)
        story += this.generateMiddle(conflict, plotDevice, style, character, setting, keywords);
        
        // End (resolution)
        story += this.generateEnding(style, character, conflict, keywords);

        // Adjust length if needed
        story = this.adjustStoryLength(story, target, style);

        return story;
    }

    extractKeywords(text) {
        const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'was', 'are', 'were', 'be', 'been', 'have', 'has', 'had', 'will', 'would', 'could', 'should'];
        return text.split(/\W+/).filter(word => word.length > 2 && !commonWords.includes(word));
    }

    selectElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    generateBeginning(prompt, character, setting, style, keywords) {
        const beginnings = [
            `In the heart of the ${setting}, a ${character} discovered something that would change everything. `,
            `The ${character} had always known that the ${setting} held secrets, but nothing could have prepared them for what they found. `,
            `It was just another ordinary day when the ${character} arrived at the ${setting}, unaware of the extraordinary events about to unfold. `,
            `The ${setting} had been quiet for years, until the ${character} arrived with a purpose that would shake its very foundations. `
        ];

        let beginning = this.selectElement(beginnings);
        
        // Incorporate user prompt elements
        if (keywords.length > 0) {
            const keyword = this.selectElement(keywords);
            beginning += `The ${keyword} had been calling to them, a whisper in the back of their mind that grew stronger with each passing day. `;
        }

        // Style-specific additions
        if (style === 'descriptive') {
            beginning += `The air was thick with anticipation, every shadow seeming to dance with hidden meaning. `;
        } else if (style === 'dialogue-heavy') {
            beginning += `"This is it," they whispered to themselves, "this is where it all begins." `;
        } else if (style === 'atmospheric') {
            beginning += `Something in the atmosphere had shifted, a subtle change that only the most perceptive would notice. `;
        }

        return beginning;
    }

    generateMiddle(conflict, plotDevice, style, character, setting, keywords) {
        let middle = `Soon, the ${character} found themselves facing ${conflict}. `;
        
        middle += `The ${plotDevice} would prove to be crucial in the events that followed. `;

        // Add complexity based on style
        if (style === 'action-packed') {
            middle += `Without warning, everything erupted into chaos. The ${character} had no time to think, only react, as the situation spiraled beyond anyone's control. `;
        } else if (style === 'dialogue-heavy') {
            middle += `"You don't understand," a voice called out from the shadows. "This isn't what it seems." The ${character} spun around, searching for the source of the warning. `;
        } else if (style === 'descriptive') {
            middle += `The ${setting} seemed to pulse with an otherworldly energy, every surface reflecting the growing tension that filled the air like a tangible presence. `;
        } else if (style === 'humorous') {
            middle += `Of course, nothing ever went according to plan. The ${character} couldn't help but laugh at the absurdity of the situation they found themselves in. `;
        }

        // Incorporate more user keywords
        if (keywords.length > 1) {
            const keyword = keywords[Math.floor(Math.random() * keywords.length)];
            middle += `The ${keyword} seemed to be at the center of it all, connecting pieces of a puzzle they were only beginning to understand. `;
        }

        return middle;
    }

    generateEnding(style, character, conflict, keywords) {
        let ending = '';

        if (style === 'humorous') {
            ending = `In the end, the ${character} realized that sometimes the best solution is the most unexpected one. With a mixture of luck and determination, they managed to resolve the situation in a way that left everyone, including themselves, slightly bewildered but ultimately satisfied. `;
        } else if (style === 'atmospheric') {
            ending = `As the dust settled, the ${character} stood in the quiet aftermath, feeling the weight of what had transpired. The experience had changed them in ways they were only beginning to understand. `;
        } else if (style === 'action-packed') {
            ending = `With one final, decisive action, the ${character} brought the conflict to its explosive conclusion. Breathing heavily, they surveyed the scene, knowing that this victory had come at a cost. `;
        } else {
            ending = `The ${character} emerged from the ordeal transformed, carrying with them the wisdom gained from facing the impossible. The ${conflict} had been resolved, but the journey had revealed truths that would stay with them forever. `;
        }

        ending += `What had begun as a simple encounter had become a defining moment, one that would be remembered long after the echoes of these events had faded into legend.`;

        return ending;
    }

    adjustStoryLength(story, target, style) {
        const words = story.split(/\s+/).length;
        
        if (words < target.min) {
            // Add more content
            const additions = [
                ` The weight of responsibility pressed down like a physical force, demanding decisions that would echo through time.`,
                ` Every choice seemed to branch into a thousand possibilities, each path fraught with its own unique challenges and rewards.`,
                ` The complexity of the situation revealed itself slowly, like layers of meaning peeling away to expose deeper truths beneath.`,
                ` Time seemed to stretch and compress, moments of clarity punctuated by periods of intense uncertainty and doubt.`
            ];
            
            while (story.split(/\s+/).length < target.min && additions.length > 0) {
                story += this.selectElement(additions);
                additions.splice(additions.indexOf(this.selectElement(additions)), 1);
            }
        }
        
        return story;
    }

    displayStory(story) {
        const outputSection = document.getElementById('output-section');
        const storyContent = document.getElementById('story-content');
        const wordCountSpan = document.getElementById('word-count');
        const readingTimeSpan = document.getElementById('reading-time');

        // Calculate stats
        const wordCount = story.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200); // Average reading speed

        // Display story
        storyContent.textContent = story;
        wordCountSpan.textContent = `${wordCount} words`;
        readingTimeSpan.textContent = `${readingTime} min read`;

        // Show output section with animation
        outputSection.classList.remove('hidden');
        outputSection.classList.add('fade-in');
        
        // Scroll to output
        outputSection.scrollIntoView({ behavior: 'smooth' });
    }

    async copyStory() {
        const storyContent = document.getElementById('story-content').textContent;
        const copyBtn = document.getElementById('copy-btn');
        const copyText = copyBtn.querySelector('.copy-text');
        const copySuccess = copyBtn.querySelector('.copy-success');

        try {
            await navigator.clipboard.writeText(storyContent);
            
            // Show success state
            copyText.classList.add('hidden');
            copySuccess.classList.remove('hidden');
            
            setTimeout(() => {
                copyText.classList.remove('hidden');
                copySuccess.classList.add('hidden');
            }, 2000);
            
        } catch (error) {
            console.error('Failed to copy story:', error);
            alert('Failed to copy story to clipboard');
        }
    }

    saveStory() {
        const storyContent = document.getElementById('story-content').textContent;
        const prompt = document.getElementById('story-prompt').value;
        const genre = document.getElementById('genre-select').value;
        
        const storyData = {
            prompt,
            genre,
            content: storyContent,
            timestamp: new Date().toISOString(),
            wordCount: storyContent.split(/\s+/).length
        };

        // Create download link
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(storyData, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `story_${Date.now()}.json`);
        downloadAnchor.click();
        
        // Also try to create a readable text version
        const textContent = `Story: ${prompt}\nGenre: ${genre}\nGenerated: ${new Date().toLocaleDateString()}\n\n${storyContent}`;
        const textDataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(textContent);
        const textDownloadAnchor = document.createElement('a');
        textDownloadAnchor.setAttribute("href", textDataStr);
        textDownloadAnchor.setAttribute("download", `story_${Date.now()}.txt`);
        textDownloadAnchor.click();

        alert('Story saved successfully!');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StoryGenerator();
    
    // Add some nice touches
    document.body.classList.add('fade-in');
    
    // Keyboard accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Clear focus from any focused element
            document.activeElement.blur();
        }
    });
});