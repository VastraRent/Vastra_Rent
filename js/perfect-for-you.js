// Perfect for You - AI Style Recommendations JavaScript

class AIStyleAnalyzer {
    constructor() {
        this.apiKey = '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';
        this.apiEndpoint = 'https://openrouter.ai/api/v1/chat/completions';
        this.currentImageData = null;
        this.selectedOccasion = null;
        this.selectedGender = null;
        this.currentRecommendations = [];
        this.filteredRecommendations = [];
        this.currentPage = 1;
        this.itemsPerPage = 6;
        this.currentView = 'grid';
        this.filters = {
            priceMin: 0,
            priceMax: 3000,
            styles: [],
            colors: []
        };
        this.enhancedFilters = {
            priceMin: 0,
            priceMax: 3000,
            styles: [],
            colors: [],
            bodyTypes: [],
            skinTones: [],
            occasions: []
        };
        this.occasionCategoryMapping = {
            men: {
                'wedding': ['Sherwani', 'Indowastern'],
                'festival': ['Kurta', 'Jodhpuri', 'Indowastern'],
                'party': ['Tuxedo', 'Suit'],
                'formal': ['Blazer', 'Suit'],
                'casual': ['Kurta', 'Blazer']
            },
            women: {
                'wedding': ['Lehnga', 'Anarkali', 'Gown'],
                'festival': ['Sharara', 'Anarkali'],
                'party': ['Suit', 'Blazer', 'Gown'],
                'formal': ['Suit', 'Blazer'],
                'casual': ['Sharara', 'Kurta', 'Blazer']
            },
            unisex: {
                'wedding': ['Blazer', 'Suit', 'Kurta'],
                'festival': ['Blazer', 'Suit', 'Kurta'],
                'party': ['Blazer', 'Suit', 'Kurta'],
                'formal': ['Blazer', 'Suit', 'Kurta'],
                'casual': ['Blazer', 'Suit', 'Kurta']
            }
        };
        this.confidenceThreshold = 0.6; // Lowered for better results
        this.maxRecommendations = 15; // Increased for better variety
        this.initializeEventListeners();
        this.clothingDatabase = this.getClothingDatabase();
        this.updateProgressIndicator();
        this.initializeAnimations();
    }

    initializeEventListeners() {
        // Gender selection event listeners
        document.querySelectorAll('.gender-option').forEach(option => {
            option.addEventListener('click', (e) => this.handleGenderSelection(e));
        });

        // Occasion selection event listeners
        document.querySelectorAll('.occasion-option').forEach(option => {
            option.addEventListener('click', (e) => this.handleOccasionSelection(e));
        });

        // File upload event listeners
        const uploadArea = document.getElementById('uploadArea');
        const photoInput = document.getElementById('photoInput');
        const uploadBtn = document.querySelector('.upload-btn');

        if (uploadArea) {
            uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
            uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        }

        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                if (photoInput) photoInput.click();
            });
        }

        if (photoInput) {
            photoInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }

        // Filter and sort event listeners
        this.initializeFilterListeners();
        this.initializePaginationListeners();
        this.initializeViewToggle();
        // Removed: this.initializeProfileDropdown(); - Let main.js handle this
    }

    initializeFilterListeners() {
        // Filter toggle
        const filterToggle = document.getElementById('filterToggle');
        if (filterToggle) {
            filterToggle.addEventListener('click', () => this.toggleFilterPanel());
        }

        // Sort dropdown
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => this.handleSort(e.target.value));
        }

        // Price range sliders
        const priceMin = document.getElementById('priceMin');
        const priceMax = document.getElementById('priceMax');
        
        if (priceMin) {
            priceMin.addEventListener('input', (e) => this.updatePriceFilter('min', e.target.value));
        }
        if (priceMax) {
            priceMax.addEventListener('input', (e) => this.updatePriceFilter('max', e.target.value));
        }

        // Style filters
        document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.updateStyleFilter(e.target.value, e.target.checked));
        });

        // Color filters
        document.querySelectorAll('.color-option').forEach(colorOption => {
            colorOption.addEventListener('click', (e) => this.toggleColorFilter(e.target.dataset.color));
        });
    }

    initializePaginationListeners() {
        const prevPage = document.getElementById('prevPage');
        const nextPage = document.getElementById('nextPage');

        if (prevPage) {
            prevPage.addEventListener('click', () => this.changePage(this.currentPage - 1));
        }
        if (nextPage) {
            nextPage.addEventListener('click', () => this.changePage(this.currentPage + 1));
        }
    }

    initializeViewToggle() {
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentView = e.target.dataset.view;
                this.updateRecommendationsView();
            });
        });
    }



    initializeAnimations() {
        // Animate gender options on page load
        const genderOptions = document.querySelectorAll('.gender-option');
        genderOptions.forEach((option, index) => {
            setTimeout(() => {
                option.classList.add('show');
            }, index * 150); // Stagger the animations
        });
    }

    handleGenderSelection(e) {
        // Remove previous selection
        document.querySelectorAll('.gender-option').forEach(opt => {
            opt.classList.remove('selected');
        });

        // Add selection to clicked option
        const selectedOption = e.currentTarget;
        selectedOption.classList.add('selected');

        this.selectedGender = selectedOption.dataset.gender;
        this.updateProgressIndicator();
        this.updateSelectionDisplay();

        // Apply gender theme
        this.applyGenderTheme(this.selectedGender);

        // Show occasion selection section with smooth animation
        const occasionSection = document.querySelector('.occasion-selection-section');
        if (occasionSection) {
            occasionSection.style.display = 'block';
            occasionSection.classList.add('slide-in');
            
            // Add show class to occasion options for fade animation
            const occasionOptions = document.querySelectorAll('.occasion-option');
            occasionOptions.forEach((option, index) => {
                setTimeout(() => {
                    option.classList.add('show');
                }, index * 100); // Stagger the animations
            });
            
            // Smooth scroll to occasion section
            setTimeout(() => {
                occasionSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 300);
        }

        // Show notification
        this.showNotification(`Selected ${this.selectedGender} category. Now choose an occasion!`, 'success');
    }

    handleOccasionSelection(e) {
        if (!this.selectedGender) {
            this.showNotification('Please select a gender category first.', 'error');
            return;
        }

        // Remove previous selection
        document.querySelectorAll('.occasion-option').forEach(opt => {
            opt.classList.remove('selected');
        });

        // Add selection to clicked option
        const selectedOption = e.currentTarget;
        selectedOption.classList.add('selected');

        this.selectedOccasion = selectedOption.dataset.occasion;
        this.updateProgressIndicator();
        this.updateSelectionDisplay();

        // Show upload section with smooth animation
        const uploadSection = document.querySelector('.upload-section');
        const uploadArea = document.querySelector('.upload-area');
        if (uploadSection && uploadArea) {
            uploadSection.style.display = 'block';
            
            // Add show class for fade animation
            setTimeout(() => {
                uploadArea.classList.add('show');
            }, 100);

            // Smooth scroll to upload section
            setTimeout(() => {
                uploadSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 300);
        }

        // Show notification
        this.showNotification(`Selected ${this.selectedOccasion} occasion. Now upload your photo!`, 'success');
    }

    updateProgressIndicator() {
        const steps = document.querySelectorAll('.progress-step');
        let currentStep = 0;

        if (this.selectedGender) currentStep = 1;
        if (this.selectedOccasion) currentStep = 2;
        if (this.currentImageData) currentStep = 3;
        if (this.currentRecommendations.length > 0) currentStep = 4;

        steps.forEach((step, index) => {
            if (index < currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (index === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }

    updateSelectionDisplay() {
        const genderDisplay = document.getElementById('selectedGenderDisplay');
        const occasionDisplay = document.getElementById('selectedOccasionDisplay');

        if (genderDisplay && this.selectedGender) {
            genderDisplay.textContent = this.selectedGender.charAt(0).toUpperCase() + this.selectedGender.slice(1);
            genderDisplay.style.display = 'inline-block';
        }

        if (occasionDisplay && this.selectedOccasion) {
            occasionDisplay.textContent = this.selectedOccasion.charAt(0).toUpperCase() + this.selectedOccasion.slice(1);
            occasionDisplay.style.display = 'inline-block';
        }
    }

    applyGenderTheme(gender) {
        const root = document.documentElement;
        
        switch (gender) {
            case 'male':
                root.style.setProperty('--gender-primary', '#2563eb');
                root.style.setProperty('--gender-secondary', '#1e40af');
                root.style.setProperty('--gender-accent', '#3b82f6');
                break;
            case 'female':
                root.style.setProperty('--gender-primary', '#ec4899');
                root.style.setProperty('--gender-secondary', '#db2777');
                root.style.setProperty('--gender-accent', '#f472b6');
                break;
            case 'unisex':
                root.style.setProperty('--gender-primary', '#8b5cf6');
                root.style.setProperty('--gender-secondary', '#7c3aed');
                root.style.setProperty('--gender-accent', '#a78bfa');
                break;
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        const uploadArea = document.getElementById('uploadArea');
        if (uploadArea) {
            uploadArea.classList.add('dragover');
        }
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        const uploadArea = document.getElementById('uploadArea');
        if (uploadArea) {
            uploadArea.classList.remove('dragover');
        }
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        const uploadArea = document.getElementById('uploadArea');
        if (uploadArea) {
            uploadArea.classList.remove('dragover');
        }

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processFile(file);
        }
        // Clear the input value to allow re-uploading the same file
        e.target.value = '';
    }

    processFile(file) {
        // Validate selections
        if (!this.selectedGender) {
            this.showNotification('Please select a gender category first.', 'error');
            return;
        }

        if (!this.selectedOccasion) {
            this.showNotification('Please select an occasion first.', 'error');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showNotification('Please select a valid image file.', 'error');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showNotification('Please select an image smaller than 5MB.', 'error');
            return;
        }

        // Display preview
        this.displayPreview(file);
    }

    displayPreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewImage = document.getElementById('previewImage');
            const previewContainer = document.getElementById('previewContainer');
            const uploadArea = document.getElementById('uploadArea');

            if (previewImage && previewContainer && uploadArea) {
                // Hide upload area
                uploadArea.style.display = 'none';

                // Show preview
                previewImage.src = e.target.result;
                previewContainer.style.display = 'block';
                
                // Add show class for fade animation
                setTimeout(() => {
                    previewContainer.classList.add('show');
                }, 100);

                // Store the image data for analysis
                this.currentImageData = e.target.result;
                this.updateProgressIndicator();

                // Show notification
                this.showNotification('Photo uploaded successfully! Click "Analyze & Get Suggestions" to continue.', 'success');
            }
        };
        reader.readAsDataURL(file);
    }

    async analyzePhoto() {
        if (!this.currentImageData) {
            this.showNotification('Please upload a photo first.', 'error');
            return;
        }

        if (!this.selectedGender || !this.selectedOccasion) {
            this.showNotification('Please select gender and occasion first.', 'error');
            return;
        }

        try {
            this.showLoadingState();
            this.animateLoadingProgress();

            // Perform AI analysis
            const analysis = await this.performAIAnalysis(this.currentImageData);
            
            // Generate recommendations
            const recommendations = await this.generateRecommendations(analysis);
            
            // Display results
            setTimeout(() => {
                this.displayResults(analysis, recommendations);
            }, 2000);

        } catch (error) {
            console.error('Analysis error:', error);
            this.hideLoadingState();
            // this.showNotification('Analysis failed. Please try again.', 'error');
        }
    }

    showLoadingState() {
        const loadingSection = document.getElementById('loadingSection');
        const uploadSection = document.querySelector('.upload-section');
        const resultsSection = document.getElementById('resultsSection');

        if (loadingSection) loadingSection.style.display = 'block';
        if (uploadSection) uploadSection.style.display = 'none';
        if (resultsSection) resultsSection.style.display = 'none';

        // Scroll to loading section
        if (loadingSection) {
            loadingSection.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    animateLoadingProgress() {
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        const loadingText = document.getElementById('loadingText');
        
        const messages = [
            'Analyzing your photo...',
            'Detecting style preferences...',
            'Finding perfect matches...',
            'Preparing recommendations...'
        ];
        
        let progress = 0;
        let messageIndex = 0;
        
        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress > 100) progress = 100;
            
            if (progressFill) progressFill.style.width = `${progress}%`;
            if (progressText) progressText.textContent = `${Math.round(progress)}%`;
            
            if (messageIndex < messages.length && progress > (messageIndex + 1) * 25) {
                if (loadingText) loadingText.textContent = messages[messageIndex];
                messageIndex++;
            }
            
            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 200);
    }

    // ... existing code ...
    async performAIAnalysis(imageData) {
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Vastra Rent - AI Style Analyzer'
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'user',
                            content: [
                                {
                                    type: 'text',
                                    text: `Analyze this photo for clothing recommendations. Please provide a JSON response with the following structure:
                                    {
                                        "gender": "${this.selectedGender}",
                                        "skinTone": "Fair/Light/Medium/Olive/Dark/Deep",
                                        "bodyType": "based on visible body shape",
                                        "faceShape": "Oval/Round/Square/Heart/Diamond/Oblong",
                                        "colorPalette": ["color1", "color2", "color3"],
                                        "style": "Traditional/Modern/Classic/Contemporary/Ethnic/Fusion",
                                        "ageGroup": "18-25/26-35/36-45/46-55/55+",
                                        "occasion": "${this.selectedOccasion}",
                                        "recommendations": "Brief style recommendations"
                                    }
                                    
                                    Focus on Indian/South Asian clothing styles and colors that would complement the person's features.`
                                },
                                {
                                    type: 'image_url',
                                    image_url: {
                                        url: imageData
                                    }
                                }
                            ]
                        }
                    ],
                    max_tokens: 500,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            const analysisText = data.choices[0].message.content;

            // Try to parse JSON from the response
            try {
                const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const result = JSON.parse(jsonMatch[0]);
                    // Ensure gender and occasion match selections
                    result.gender = this.selectedGender;
                    result.occasion = this.selectedOccasion;
                    return result;
                }
            } catch (parseError) {
                console.warn('Could not parse AI response as JSON, using fallback');
            }

            // Fallback to mock analysis if parsing fails
            return this.getMockAnalysis();

        } catch (error) {
            
            return this.getMockAnalysis();
        }
    }

    getMockAnalysis() {
        return {
            gender: this.selectedGender || 'unisex',
            skinTone: this.getRandomSkinTone(),
            bodyType: 'Rectangle',
            faceShape: this.getRandomFaceShape(),
            colorPalette: ['Navy Blue', 'White', 'Gold'],
            style: 'Modern',
            ageGroup: '26-35',
            occasion: this.selectedOccasion || 'Party',
            recommendations: 'Based on your features, we recommend elegant and versatile pieces that complement your style.'
        };
    }

    async generateRecommendations(analysis) {
        console.log('Generating occasion-specific recommendations for', analysis.gender, analysis.occasion);
        
        // Get preferred categories for this occasion and gender
        const userGender = analysis.gender === 'male' ? 'men' : analysis.gender === 'female' ? 'women' : 'men';
        const occasionLower = analysis.occasion.toLowerCase();
        const preferredCategories = this.occasionCategoryMapping[userGender]?.[occasionLower] || [];
        
        console.log('Preferred categories:', preferredCategories);
        
        // Filter and score all items
        const scoredItems = this.clothingDatabase
            .map(item => {
                const itemCopy = { ...item };
                const matches = this.matchesAnalysis(itemCopy, analysis);
                return matches ? itemCopy : null;
            })
            .filter(item => item !== null);

        // Separate preferred category items from others
        const preferredItems = scoredItems.filter(item => 
            preferredCategories.includes(item.category)
        );
        const otherItems = scoredItems.filter(item => 
            !preferredCategories.includes(item.category)
        );

        // Sort preferred items by score, then other items
        const sortedPreferred = preferredItems.sort((a, b) => {
            if (b.matchScore !== a.matchScore) {
                return b.matchScore - a.matchScore;
            }
            return b.confidence - a.confidence;
        });

        const sortedOthers = otherItems.sort((a, b) => {
            if (b.matchScore !== a.matchScore) {
                return b.matchScore - a.matchScore;
            }
            return b.confidence - a.confidence;
        });

        // Combine results: preferred categories first, then others
        const recommendations = [
            ...sortedPreferred.slice(0, Math.max(8, this.maxRecommendations * 0.6)),
            ...sortedOthers.slice(0, Math.max(4, this.maxRecommendations * 0.4))
        ].slice(0, this.maxRecommendations);

        // Add recommendation reasons with category-specific messaging
        recommendations.forEach(item => {
            item.recommendationReason = this.generateOccasionSpecificReason(item, analysis, preferredCategories);
            item.isPreferredCategory = preferredCategories.includes(item.category);
        });

        console.log('Generated recommendations:', recommendations.length, 'items');
        console.log('Preferred category items:', recommendations.filter(r => r.isPreferredCategory).length);

        this.currentRecommendations = recommendations;
        this.applyFilters();
        return this.filteredRecommendations;
    }

    matchesAnalysis(item, analysis) {
        let score = 0;
        let confidence = 0;
        const weights = {
            occasionCategory: 0.40,  // Highest priority for occasion-category match
            gender: 0.30,           // Second priority
            color: 0.15,            // Third priority
            style: 0.08,            // Fourth priority
            bodyType: 0.04,         // Fifth priority
            skinTone: 0.02,         // Sixth priority
            ageGroup: 0.01          // Lowest priority
        };

        // Gender matching (mandatory)
        if (item.gender === analysis.gender) {
            score += 100 * weights.gender;
            confidence += weights.gender;
        } else if (item.gender === 'unisex') {
            score += 70 * weights.gender;
            confidence += weights.gender * 0.7;
        } else {
            // Wrong gender - return false immediately
            return false;
        }

        // Occasion-Category matching (most important for accuracy)
        const userGender = analysis.gender === 'male' ? 'men' : analysis.gender === 'female' ? 'women' : 'men';
        const occasionLower = analysis.occasion.toLowerCase();
        const allowedCategories = this.occasionCategoryMapping[userGender]?.[occasionLower] || [];
        
        if (allowedCategories.length > 0) {
            if (allowedCategories.includes(item.category)) {
                score += 100 * weights.occasionCategory;
                confidence += weights.occasionCategory;
            } else {
                // Category not suitable for this occasion - heavily penalize
                score += 10 * weights.occasionCategory;
                confidence += weights.occasionCategory * 0.1;
            }
        } else {
            // Fallback to general occasion matching
            if (item.occasions && item.occasions.some(occ => 
                occ.toLowerCase() === occasionLower ||
                this.getRelatedOccasions(occasionLower).includes(occ.toLowerCase())
            )) {
                score += 80 * weights.occasionCategory;
                confidence += weights.occasionCategory * 0.8;
            } else {
                score += 20 * weights.occasionCategory;
                confidence += weights.occasionCategory * 0.2;
            }
        }

        // Enhanced color matching
        if (analysis.colorPalette && item.colors) {
            const colorScore = this.calculateColorHarmony(analysis.colorPalette, item.colors);
            score += colorScore * weights.color;
            confidence += (colorScore / 100) * weights.color;
        }

        // Style matching
        if (item.style && analysis.style) {
            const styleCompatibility = this.getStyleCompatibility(analysis.style, item.style);
            score += styleCompatibility * weights.style;
            confidence += (styleCompatibility / 100) * weights.style;
        }

        // Body type matching
        if (item.bodyTypes && analysis.bodyType) {
            const bodyTypeMatch = item.bodyTypes.includes(analysis.bodyType) || 
                                item.bodyTypes.includes('All');
            if (bodyTypeMatch) {
                score += 100 * weights.bodyType;
                confidence += weights.bodyType;
            }
        }

        // Skin tone matching
        if (item.skinTones && analysis.skinTone) {
            const skinToneMatch = item.skinTones.includes(analysis.skinTone) || 
                                item.skinTones.includes('All');
            if (skinToneMatch) {
                score += 100 * weights.skinTone;
                confidence += weights.skinTone;
            }
        }

        // Age group matching
        if (item.ageGroups && analysis.ageGroup) {
            const ageMatch = item.ageGroups.includes(analysis.ageGroup);
            if (ageMatch) {
                score += 100 * weights.ageGroup;
                confidence += weights.ageGroup;
            }
        }

        // Calculate final scores
        item.matchScore = Math.min(Math.round(score), 100);
        item.confidence = Math.min(confidence, 1.0);
        
        // Only return items above confidence threshold
        return confidence >= this.confidenceThreshold && score > 50;
    }

    // Filter and sort methods
    toggleFilterPanel() {
        const filterPanel = document.getElementById('filterPanel');
        if (filterPanel) {
            filterPanel.classList.toggle('show');
        }
    }

    updatePriceFilter(type, value) {
        this.filters[`price${type.charAt(0).toUpperCase() + type.slice(1)}`] = parseInt(value);
        
        const label = document.getElementById(`price${type.charAt(0).toUpperCase() + type.slice(1)}Label`);
        if (label) {
            label.textContent = `₹${value}`;
        }
        
        this.applyFilters();
    }

    updateStyleFilter(style, checked) {
        if (checked) {
            this.filters.styles.push(style);
        } else {
            this.filters.styles = this.filters.styles.filter(s => s !== style);
        }
        this.applyFilters();
    }

    toggleColorFilter(color) {
        const colorOption = document.querySelector(`[data-color="${color}"]`);
        if (colorOption) {
            colorOption.classList.toggle('selected');
            
            if (this.filters.colors.includes(color)) {
                this.filters.colors = this.filters.colors.filter(c => c !== color);
            } else {
                this.filters.colors.push(color);
            }
            
            this.applyFilters();
        }
    }

    applyFilters() {
        if (!this.currentRecommendations.length) return;

        this.filteredRecommendations = this.currentRecommendations.filter(item => {
            // Price filter
            if (item.price < this.filters.priceMin || item.price > this.filters.priceMax) {
                return false;
            }

            // Style filter
            if (this.filters.styles.length > 0 && !this.filters.styles.includes(item.style.toLowerCase())) {
                return false;
            }

            // Color filter
            if (this.filters.colors.length > 0) {
                const hasMatchingColor = this.filters.colors.some(filterColor => 
                    item.colors.some(itemColor => 
                        itemColor.toLowerCase().includes(filterColor.toLowerCase())
                    )
                );
                if (!hasMatchingColor) return false;
            }

            return true;
        });

        this.currentPage = 1;
        this.updateRecommendationsView();
        this.updatePagination();
    }

    handleSort(sortType) {
        if (!this.filteredRecommendations.length) return;

        switch (sortType) {
            case 'match':
                this.filteredRecommendations.sort((a, b) => b.matchScore - a.matchScore);
                break;
            case 'price-low':
                this.filteredRecommendations.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredRecommendations.sort((a, b) => b.price - a.price);
                break;
            case 'popular':
                // Sort by a combination of match score and random factor for "popularity"
                this.filteredRecommendations.sort((a, b) => (b.matchScore + Math.random() * 20) - (a.matchScore + Math.random() * 20));
                break;
        }

        this.updateRecommendationsView();
    }

    // Pagination methods
    changePage(page) {
        const totalPages = Math.ceil(this.filteredRecommendations.length / this.itemsPerPage);
        if (page < 1 || page > totalPages) return;

        this.currentPage = page;
        this.updateRecommendationsView();
        this.updatePagination();
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredRecommendations.length / this.itemsPerPage);
        const pageNumbers = document.getElementById('pageNumbers');
        const prevPage = document.getElementById('prevPage');
        const nextPage = document.getElementById('nextPage');

        if (pageNumbers) {
            pageNumbers.innerHTML = '';
            for (let i = 1; i <= totalPages; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.className = `page-number ${i === this.currentPage ? 'active' : ''}`;
                pageBtn.textContent = i;
                pageBtn.addEventListener('click', () => this.changePage(i));
                pageNumbers.appendChild(pageBtn);
            }
        }

        if (prevPage) prevPage.disabled = this.currentPage === 1;
        if (nextPage) nextPage.disabled = this.currentPage === totalPages;
    }

    updateRecommendationsView() {
        const recommendationsGrid = document.getElementById('recommendationsGrid');
        if (!recommendationsGrid) return;

        recommendationsGrid.className = `recommendations-grid ${this.currentView}-view`;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageItems = this.filteredRecommendations.slice(startIndex, endIndex);

        if (pageItems.length === 0) {
            recommendationsGrid.innerHTML = `
                <div class="no-recommendations">
                    <h3>No suitable items found</h3>
                    <p>Try selecting a different occasion or upload a clearer photo.</p>
                    <button class="btn btn-primary" onclick="clearFilters()">Clear Filters</button>
                </div>
            `;
            return;
        }

        recommendationsGrid.innerHTML = pageItems.map((item, index) => {
            const confidenceLevel = item.confidence >= 0.8 ? 'high' : 
                                  item.confidence >= 0.6 ? 'medium' : 'low';
            const confidenceText = item.confidence >= 0.8 ? 'Excellent Match' : 
                                  item.confidence >= 0.6 ? 'Good Match' : 'Fair Match';
            
            const preferredBadge = item.isPreferredCategory ? 
                '<div class="preferred-badge"><i class="fas fa-star"></i> Recommended</div>' : '';
            
            return `
                <div class="recommendation-card ${this.currentView}-card ${item.isPreferredCategory ? 'preferred' : ''}">
                    <div class="gender-badge ${item.gender}">${item.gender}</div>
                    ${preferredBadge}
                    <div class="match-score ${confidenceLevel}">
                        ${item.matchScore}% Match
                        <span class="confidence-indicator">${confidenceText}</span>
                    </div>
                    <img src="${item.image}" alt="${item.name}" class="recommendation-image" onerror="this.src='img/placeholder.jpg'">
                    <div class="recommendation-content">
                        <h3 class="recommendation-title">${item.name}</h3>
                        <div class="category-tag">${item.category}</div>
                        <p class="recommendation-description">${item.description}</p>
                        <div class="recommendation-reason">
                            <i class="fas fa-lightbulb"></i>
                            ${item.recommendationReason || 'Great choice for you'}
                        </div>
                        <div class="recommendation-price">₹${item.price}/day</div>
                        <div class="recommendation-actions">
                            <button class="btn-small btn-view" onclick="viewProduct('${item.id}')">
                                View Details
                            </button>
                            <button class="btn-small btn-quick-view" onclick="openQuickView('${item.id}')">
                                Quick View
                            </button>
                            <button class="btn-small btn-wishlist" onclick="addToWishlist('${item.id}')">
                                ❤️
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    hideLoadingState() {
        const loadingSection = document.getElementById('loadingSection');
        if (loadingSection) {
            loadingSection.style.display = 'none';
        }
    }

    displayResults(analysis, recommendations) {
        this.hideLoadingState();
        this.updateProgressIndicator();

        // Display analysis results
        this.displayAnalysisResults(analysis);

        // Display recommendations
        this.displayRecommendations(recommendations);

        // Show results section
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection) {
            resultsSection.style.display = 'block';
            resultsSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    displayAnalysisResults(analysis) {
        const analysisResults = document.getElementById('analysisResults');
        if (!analysisResults) return;

        analysisResults.innerHTML = `
            <div class="analysis-results">
                <div class="analysis-item">
                    <h4>Gender</h4>
                    <p>${analysis.gender ? analysis.gender.charAt(0).toUpperCase() + analysis.gender.slice(1) : 'Not specified'}</p>
                </div>
                <div class="analysis-item">
                    <h4>Occasion</h4>
                    <p>${analysis.occasion ? analysis.occasion.charAt(0).toUpperCase() + analysis.occasion.slice(1) : 'Not specified'}</p>
                </div>
                <div class="analysis-item">
                    <h4>Skin Tone</h4>
                    <p>${analysis.skinTone || 'Not specified'}</p>
                </div>
                <div class="analysis-item">
                    <h4>Body Type</h4>
                    <p>${analysis.bodyType || 'Not specified'}</p>
                </div>
                <div class="analysis-item">
                    <h4>Recommended Colors</h4>
                    <p>${analysis.colorPalette ? analysis.colorPalette.join(', ') : 'Not specified'}</p>
                </div>
                <div class="analysis-item">
                    <h4>Style Preference</h4>
                    <p>${analysis.style || 'Not specified'}</p>
                </div>
            </div>
        `;
    }

    displayRecommendations(recommendations) {
        this.filteredRecommendations = recommendations;
        this.updateRecommendationsView();
        this.updatePagination();
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            notification.remove();
        });

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer; margin-left: auto;">&times;</button>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Mock data generators
    getRandomSkinTone() {
        const tones = ['Fair', 'Light', 'Medium', 'Olive', 'Dark', 'Deep'];
        return tones[Math.floor(Math.random() * tones.length)];
    }

    getRandomFaceShape() {
        const shapes = ['Oval', 'Round', 'Square', 'Heart', 'Diamond', 'Oblong'];
        return shapes[Math.floor(Math.random() * shapes.length)];
    }

    // ... existing code ...
    getClothingDatabase() {
        // Import inventory data from inventory.js
        if (typeof inventoryData !== 'undefined' && inventoryData.length > 0) {
            console.log('Using enhanced inventory data mapping:', inventoryData.length, 'items');
            return inventoryData.map(item => ({
                id: item.id.toString(),
                name: item.name,
                description: item.description,
                price: item.price,
                image: item.image,
                gender: item.gender === 'men' ? 'male' : item.gender === 'women' ? 'female' : 'unisex',
                colors: this.extractColorsFromName(item.name),
                style: this.mapCategoryToStyle(item.category),
                occasions: this.mapCategoryToOccasions(item.category),
                bodyTypes: this.inferBodyTypes(item.category, item.gender),
                skinTones: this.inferSkinTones(item.name, item.category),
                ageGroups: this.inferAgeGroups(item.category, item.price),
                category: item.category,
                size: item.size,
                available: item.available,
                matchScore: 0,
                confidence: 0
            }));
        }
        
        // Try to get from shared inventory as fallback
        if (window.getSharedInventoryData) {
            const sharedData = window.getSharedInventoryData();
            if (sharedData && sharedData.length > 0) {
                console.log('Using shared inventory data:', sharedData.length, 'items');
                return sharedData.map(item => ({
                    id: item.id.toString(),
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    image: item.image,
                    gender: item.gender === 'men' ? 'male' : item.gender === 'women' ? 'female' : 'unisex',
                    colors: this.extractColorsFromName(item.name),
                    style: this.mapCategoryToStyle(item.category),
                    occasions: this.mapCategoryToOccasions(item.category),
                    bodyTypes: this.inferBodyTypes(item.category, item.gender),
                    skinTones: this.inferSkinTones(item.name, item.category),
                    ageGroups: this.inferAgeGroups(item.category, item.price),
                    category: item.category,
                    size: item.size,
                    available: item.available,
                    matchScore: 0,
                    confidence: 0
                }));
            }
        }
        
        console.warn('No inventory data found, using empty array');
        return [];
    }

    // Helper method to extract colors from item names
    extractColorsFromName(name) {
        const colorKeywords = {
            'white': ['White'],
            'black': ['Black'],
            'blue': ['Blue'],
            'navy': ['Navy Blue'],
            'red': ['Red'],
            'green': ['Green'],
            'yellow': ['Yellow'],
            'purple': ['Purple'],
            'violet': ['Violet'],
            'pink': ['Pink'],
            'grey': ['Grey'],
            'gray': ['Gray'],
            'maroon': ['Maroon'],
            'gold': ['Gold'],
            'silver': ['Silver'],
            'brown': ['Brown'],
            'orange': ['Orange']
        };
        
        const nameLower = name.toLowerCase();
        const foundColors = [];
        
        Object.keys(colorKeywords).forEach(keyword => {
            if (nameLower.includes(keyword)) {
                foundColors.push(...colorKeywords[keyword]);
            }
        });
        
        return foundColors.length > 0 ? foundColors : ['Multi-color'];
    }

    // Enhanced style mapping for better categorization
    mapCategoryToStyle(category) {
        const styleMapping = {
            'Jodhpuri': 'Traditional',
            'Kurta': 'Traditional',
            'Sherwani': 'Traditional',
            'Tuxedo': 'Formal',
            'Suit': 'Formal',
            'Blazer': 'Modern',
            'Indowastern': 'Fusion',
            'Anarkali': 'Traditional',
            'Gown': 'Formal',
            'Lehnga': 'Traditional',
            'Sharara': 'Traditional'
        };
        
        return styleMapping[category] || 'Modern';
    }

    // Enhanced category to occasions mapping
    mapCategoryToOccasions(category) {
        const occasionMapping = {
            'Jodhpuri': ['Festival', 'Wedding', 'Traditional'],
            'Kurta': ['Festival', 'Casual', 'Traditional'],
            'Sherwani': ['Wedding', 'Festival'],
            'Tuxedo': ['Party', 'Wedding', 'Formal'],
            'Suit': ['Party', 'Formal', 'Business'],
            'Blazer': ['Formal', 'Business', 'Casual'],
            'Indowastern': ['Wedding', 'Festival', 'Party'],
            'Anarkali': ['Wedding', 'Festival', 'Party'],
            'Gown': ['Party', 'Wedding', 'Formal'],
            'Lehnga': ['Wedding', 'Festival'],
            'Sharara': ['Wedding', 'Festival', 'Party']
        };
        
        return occasionMapping[category] || ['Party', 'Casual'];
    }

    // New method: Calculate color harmony
    calculateColorHarmony(userColors, itemColors) {
        const colorHarmonyMap = {
            'blue': ['white', 'silver', 'gold', 'navy', 'cream'],
            'red': ['gold', 'cream', 'black', 'white'],
            'green': ['gold', 'cream', 'brown', 'white'],
            'yellow': ['blue', 'purple', 'black', 'white'],
            'purple': ['gold', 'silver', 'white', 'cream'],
            'pink': ['gold', 'silver', 'white', 'cream'],
            'black': ['gold', 'silver', 'white', 'red'],
            'white': ['all'], // White goes with everything
            'gold': ['red', 'green', 'blue', 'purple', 'black'],
            'silver': ['blue', 'purple', 'black', 'white']
        };

        let harmonyScore = 0;
        let maxPossibleScore = userColors.length * itemColors.length;

        userColors.forEach(userColor => {
            itemColors.forEach(itemColor => {
                const userColorLower = userColor.toLowerCase();
                const itemColorLower = itemColor.toLowerCase();
                
                // Direct match
                if (userColorLower === itemColorLower) {
                    harmonyScore += 100;
                } else {
                    // Check harmony
                    const harmonies = colorHarmonyMap[userColorLower] || [];
                    if (harmonies.includes('all') || 
                        harmonies.some(h => itemColorLower.includes(h))) {
                        harmonyScore += 80;
                    } else {
                        harmonyScore += 20; // Minimal score for non-matching colors
                    }
                }
            });
        });

        return maxPossibleScore > 0 ? (harmonyScore / maxPossibleScore) : 50;
    }

    // New method: Get style compatibility
    getStyleCompatibility(userStyle, itemStyle) {
        const styleCompatibility = {
            'Traditional': {
                'Traditional': 100,
                'Fusion': 80,
                'Classic': 70,
                'Modern': 40,
                'Formal': 60
            },
            'Modern': {
                'Modern': 100,
                'Formal': 90,
                'Fusion': 70,
                'Classic': 60,
                'Traditional': 40
            },
            'Formal': {
                'Formal': 100,
                'Modern': 90,
                'Classic': 80,
                'Traditional': 60,
                'Fusion': 50
            },
            'Fusion': {
                'Fusion': 100,
                'Traditional': 80,
                'Modern': 70,
                'Classic': 60,
                'Formal': 50
            },
            'Classic': {
                'Classic': 100,
                'Formal': 80,
                'Traditional': 70,
                'Modern': 60,
                'Fusion': 60
            }
        };

        return styleCompatibility[userStyle]?.[itemStyle] || 50;
    }

    // New method: Get related occasions
    getRelatedOccasions(occasion) {
        const occasionRelations = {
            'wedding': ['formal', 'party', 'festival'],
            'party': ['formal', 'wedding'],
            'formal': ['business', 'wedding', 'party'],
            'casual': ['festival'],
            'festival': ['traditional', 'casual', 'wedding'],
            'business': ['formal']
        };

        return occasionRelations[occasion.toLowerCase()] || [];
    }

    // New method: Generate occasion-specific recommendation reasons
    generateOccasionSpecificReason(item, analysis, preferredCategories) {
        const reasons = [];
        
        if (preferredCategories.includes(item.category)) {
            reasons.push(`Perfect ${item.category} for ${analysis.occasion}`);
        } else {
            reasons.push(`Alternative choice for ${analysis.occasion}`);
        }
        
        if (item.gender === analysis.gender) {
            reasons.push(`Designed for ${analysis.gender}`);
        }
        
        if (analysis.colorPalette && item.colors) {
            const colorMatch = analysis.colorPalette.some(color => 
                item.colors.some(itemColor => 
                    itemColor.toLowerCase().includes(color.toLowerCase())
                )
            );
            if (colorMatch) {
                reasons.push(`Matches your color preferences`);
            }
        }
        
        return reasons.length > 0 ? reasons.join(' • ') : `Great choice for ${analysis.occasion}`;
    }

    // Legacy method for backward compatibility
    generateRecommendationReason(item, analysis) {
        const reasons = [];
        
        if (item.gender === analysis.gender) {
            reasons.push(`Perfect gender match`);
        }
        
        if (item.occasions && item.occasions.includes(analysis.occasion)) {
            reasons.push(`Ideal for ${analysis.occasion} occasions`);
        }
        
        if (analysis.colorPalette && item.colors) {
            const colorMatch = analysis.colorPalette.some(color => 
                item.colors.some(itemColor => 
                    itemColor.toLowerCase().includes(color.toLowerCase())
                )
            );
            if (colorMatch) {
                reasons.push(`Complements your color palette`);
            }
        }
        
        if (item.style === analysis.style) {
            reasons.push(`Matches your ${analysis.style.toLowerCase()} style`);
        }
        
        return reasons.length > 0 ? reasons.join(' • ') : 'Great choice for you';
    }

    // New method: Infer body types based on category and gender
    inferBodyTypes(category, gender) {
        const bodyTypeMapping = {
            'Jodhpuri': gender === 'men' ? ['Rectangle', 'Inverted Triangle', 'Athletic'] : ['All'],
            'Kurta': ['All'],
            'Sherwani': gender === 'men' ? ['Rectangle', 'Inverted Triangle'] : ['All'],
            'Tuxedo': ['Rectangle', 'Inverted Triangle', 'Athletic'],
            'Suit': ['Rectangle', 'Inverted Triangle'],
            'Blazer': ['All'],
            'Indowastern': ['All'],
            'Anarkali': ['Apple', 'Pear', 'Rectangle'],
            'Gown': ['Hourglass', 'Rectangle', 'Pear'],
            'Lehnga': ['Pear', 'Hourglass', 'Apple'],
            'Sharara': ['Pear', 'Apple', 'Hourglass']
        };
        
        return bodyTypeMapping[category] || ['All'];
    }

    // New method: Infer skin tones based on colors and category
    inferSkinTones(name, category) {
        const nameLower = name.toLowerCase();
        
        // Colors that work well with specific skin tones
        if (nameLower.includes('gold') || nameLower.includes('yellow') || nameLower.includes('orange')) {
            return ['Medium', 'Olive', 'Dark'];
        }
        if (nameLower.includes('silver') || nameLower.includes('blue') || nameLower.includes('purple')) {
            return ['Fair', 'Light', 'Medium'];
        }
        if (nameLower.includes('red') || nameLower.includes('maroon') || nameLower.includes('burgundy')) {
            return ['Light', 'Medium', 'Olive'];
        }
        
        return ['All']; // Default to all skin tones
    }

    // New method: Infer age groups based on category and price
    inferAgeGroups(category, price) {
        const traditionalCategories = ['Jodhpuri', 'Sherwani', 'Anarkali', 'Lehnga'];
        const modernCategories = ['Blazer', 'Suit', 'Gown'];
        
        if (traditionalCategories.includes(category)) {
            return price > 40 ? ['26-35', '36-45'] : ['18-25', '26-35'];
        }
        if (modernCategories.includes(category)) {
            return ['26-35', '36-45', '46-55'];
        }
        
        return ['18-25', '26-35', '36-45']; // Default age groups
    }
}

// Global functions that are called from HTML onclick attributes
function clearPhoto() {
    if (window.aiAnalyzer) {
        const uploadArea = document.getElementById('uploadArea');
        const previewContainer = document.getElementById('previewContainer');
        const resultsSection = document.getElementById('resultsSection');
        const photoInput = document.getElementById('photoInput');

        if (uploadArea) uploadArea.style.display = 'block';
        if (previewContainer) previewContainer.style.display = 'none';
        if (resultsSection) resultsSection.style.display = 'none';

        if (photoInput) {
            photoInput.value = '';
        }

        // Clear the stored image data
        window.aiAnalyzer.currentImageData = null;
        window.aiAnalyzer.updateProgressIndicator();
    }
}

function analyzePhoto() {
    if (window.aiAnalyzer) {
        window.aiAnalyzer.analyzePhoto();
    }
}

function viewProduct(productId) {
    console.log('Viewing product:', productId);
    
    // Find the product in the current recommendations or clothing database
    let product = null;
    
    if (window.aiAnalyzer) {
        // First try to find in current recommendations
        product = window.aiAnalyzer.currentRecommendations.find(item => item.id.toString() === productId.toString());
        
        // If not found, try in the full clothing database
        if (!product) {
            product = window.aiAnalyzer.clothingDatabase.find(item => item.id.toString() === productId.toString());
        }
    }
    
    if (product) {
        // Store the selected item for the product details page
        localStorage.setItem('selectedItem', JSON.stringify(product));
        localStorage.setItem('currentItemId', productId.toString());
        
        // Show loading notification
        if (window.aiAnalyzer) {
            window.aiAnalyzer.showNotification('Loading product details...', 'info');
        }
        
        // Redirect to product details page
        setTimeout(() => {
            window.location.href = `product-details.html?id=${productId}`;
        }, 500);
    } else {
        console.error('Product not found:', productId);
        if (window.aiAnalyzer) {
            window.aiAnalyzer.showNotification('Product not found. Please try again.', 'error');
        }
    }
}

function openQuickView(productId) {
    console.log('Opening quick view for:', productId);
    
    const modal = document.getElementById('quickViewModal');
    const content = document.getElementById('quickViewContent');
    
    if (window.aiAnalyzer && modal && content) {
        // Find product in recommendations or database
        let product = window.aiAnalyzer.currentRecommendations.find(item => item.id.toString() === productId.toString()) ||
                     window.aiAnalyzer.clothingDatabase.find(item => item.id.toString() === productId.toString());
        
        if (product) {
            content.innerHTML = `
                <div class="quick-view-product">
                    <div class="quick-view-image">
                        <img src="${product.image}" alt="${product.name}" onerror="this.src='img/placeholder.svg'">
                        <div class="quick-view-badge">
                            <span class="match-score">${product.matchScore || 85}% Match</span>
                        </div>
                    </div>
                    <div class="quick-view-details">
                        <div class="category-tag">${product.category}</div>
                        <h3>${product.name}</h3>
                        <p class="description">${product.description}</p>
                        <div class="price-section">
                            <div class="price">₹${product.price}/day</div>
                            ${product.weeklyPrice ? `<div class="weekly-price">₹${product.weeklyPrice}/week</div>` : ''}
                        </div>
                        <div class="product-info">
                            <div class="info-item">
                                <strong>Style:</strong> ${product.style || 'Modern'}
                            </div>
                            <div class="info-item">
                                <strong>Colors:</strong> ${product.colors ? product.colors.join(', ') : 'Multiple'}
                            </div>
                            <div class="info-item">
                                <strong>Occasions:</strong> ${product.occasions ? product.occasions.join(', ') : 'Versatile'}
                            </div>
                            ${product.recommendationReason ? `
                                <div class="info-item recommendation-highlight">
                                    <strong>Why this suits you:</strong> ${product.recommendationReason}
                                </div>
                            ` : ''}
                        </div>
                        <div class="quick-view-actions">
                            <button class="btn-primary" onclick="viewProduct('${product.id}')">
                                <i class="fas fa-eye"></i> View Full Details
                            </button>
                            <button class="btn-secondary" onclick="addToWishlist('${product.id}')">
                                <i class="fas fa-heart"></i> Add to Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        } else {
            window.aiAnalyzer.showNotification('Product details not available', 'error');
        }
    }
}

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function addToWishlist(productId) {
    console.log('Adding to wishlist:', productId);
    
    // Get current wishlist
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (!wishlist.includes(productId.toString())) {
        wishlist.push(productId.toString());
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        // Update wishlist count in header
        const wishlistCount = document.getElementById('header-wishlist-count');
        if (wishlistCount) {
            wishlistCount.textContent = wishlist.length;
        }
        
        if (window.aiAnalyzer) {
            window.aiAnalyzer.showNotification('Added to wishlist! ❤️', 'success');
        }
        
        // Update button state
        const wishlistBtn = document.querySelector(`button[onclick="addToWishlist('${productId}')"]`);
        if (wishlistBtn) {
            wishlistBtn.classList.add('active');
            wishlistBtn.innerHTML = '💖';
        }
    } else {
        if (window.aiAnalyzer) {
            window.aiAnalyzer.showNotification('Already in wishlist', 'info');
        }
    }
}

function clearFilters() {
    if (window.aiAnalyzer) {
        // Reset filters
        window.aiAnalyzer.filters = {
            priceMin: 0,
            priceMax: 3000,
            styles: [],
            colors: []
        };
        
        // Reset UI elements
        const priceMin = document.getElementById('priceMin');
        const priceMax = document.getElementById('priceMax');
        const priceMinLabel = document.getElementById('priceMinLabel');
        const priceMaxLabel = document.getElementById('priceMaxLabel');
        
        if (priceMin) priceMin.value = 0;
        if (priceMax) priceMax.value = 3000;
        if (priceMinLabel) priceMinLabel.textContent = '₹0';
        if (priceMaxLabel) priceMaxLabel.textContent = '₹3000';
        
        // Clear checkboxes
        document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Clear color selections
        document.querySelectorAll('.color-option').forEach(colorOption => {
            colorOption.classList.remove('selected');
        });
        
        // Reapply filters
        window.aiAnalyzer.applyFilters();
        window.aiAnalyzer.showNotification('Filters cleared', 'info');
    }
}

// Enhanced clearAll function
function clearAll() {
    const uploadArea = document.getElementById('uploadArea');
    const previewContainer = document.getElementById('previewContainer');
    const resultsSection = document.getElementById('resultsSection');
    const uploadSection = document.querySelector('.upload-section');
    const photoInput = document.getElementById('photoInput');
    const genderDisplay = document.getElementById('selectedGenderDisplay');
    const occasionDisplay = document.getElementById('selectedOccasionDisplay');

    if (uploadArea) uploadArea.style.display = 'block';
    if (previewContainer) previewContainer.style.display = 'none';
    if (resultsSection) resultsSection.style.display = 'none';
    if (uploadSection) uploadSection.style.display = 'none';
    if (genderDisplay) genderDisplay.style.display = 'none';
    if (occasionDisplay) occasionDisplay.style.display = 'none';

    if (photoInput) {
        photoInput.value = '';
    }

    // Clear gender selection
    document.querySelectorAll('.gender-option').forEach(opt => {
        opt.classList.remove('selected');
    });

    // Clear occasion selection
    document.querySelectorAll('.occasion-option').forEach(opt => {
        opt.classList.remove('selected');
    });

    // Clear the stored data
    if (window.aiAnalyzer) {
        window.aiAnalyzer.currentImageData = null;
        window.aiAnalyzer.selectedOccasion = null;
        window.aiAnalyzer.selectedGender = null;
        window.aiAnalyzer.currentRecommendations = [];
        window.aiAnalyzer.filteredRecommendations = [];
        window.aiAnalyzer.updateProgressIndicator();
        window.aiAnalyzer.showNotification('Cleared all selections. Please start over.', 'info');
    }

    // Reset theme
    const root = document.documentElement;
    root.style.setProperty('--gender-primary', '#6366f1');
    root.style.setProperty('--gender-secondary', '#4f46e5');
    root.style.setProperty('--gender-accent', '#818cf8');
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('quickViewModal');
    if (modal && e.target === modal) {
        closeQuickView();
    }
});

// Initialize the AI Style Analyzer when the page loads
document.addEventListener('DOMContentLoaded', function () {
    window.aiAnalyzer = new AIStyleAnalyzer();
    console.log('AI Style Analyzer initialized');
});