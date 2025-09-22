/**
 * DEVELOPER DOCUMENTATION
 *
 * Include your custom JavaScript here.
 *
 * The theme Focal has been developed to be easily extensible through the usage of a lot of different JavaScript
 * events, as well as the usage of custom elements (https://developers.google.com/web/fundamentals/web-components/customelements)
 * to easily extend the theme and re-use the theme infrastructure for your own code.
 *
 * The technical documentation is summarized here.
 *
 * ------------------------------------------------------------------------------------------------------------
 * BEING NOTIFIED WHEN A VARIANT HAS CHANGED
 * ------------------------------------------------------------------------------------------------------------
 *
 * This event is fired whenever a the user has changed the variant in a selector. The target get you the form
 * that triggered this event.
 *
 * Example:
 *
 * document.addEventListener('variant:changed', function(event) {
 *   let variant = event.detail.variant; // Gives you access to the whole variant details
 *   let form = event.target;
 * });
 *
 * ------------------------------------------------------------------------------------------------------------
 * MANUALLY CHANGE A VARIANT
 * ------------------------------------------------------------------------------------------------------------
 *
 * You may want to manually change the variant, and let the theme automatically adjust all the selectors. To do
 * that, you can get the DOM element of type "<product-variants>", and call the selectVariant method on it with
 * the variant ID.
 *
 * Example:
 *
 * const productVariantElement = document.querySelector('product-variants');
 * productVariantElement.selectVariant(12345);
 *
 * ------------------------------------------------------------------------------------------------------------
 * BEING NOTIFIED WHEN A NEW VARIANT IS ADDED TO THE CART
 * ------------------------------------------------------------------------------------------------------------
 *
 * This event is fired whenever a variant is added to the cart through a form selector (product page, quick
 * view...). This event DOES NOT include any change done through the cart on an existing variant. For that,
 * please refer to the "cart:updated" event.
 *
 * Example:
 *
 * document.addEventListener('variant:added', function(event) {
 *   var variant = event.detail.variant; // Get the variant that was added
 * });
 *
 * ------------------------------------------------------------------------------------------------------------
 * BEING NOTIFIED WHEN THE CART CONTENT HAS CHANGED
 * ------------------------------------------------------------------------------------------------------------
 *
 * This event is fired whenever the cart content has changed (if the quantity of a variant has changed, if a variant
 * has been removed, if the note has changed...). This event will also be emitted when a new variant has been
 * added (so you will receive both "variant:added" and "cart:updated"). Contrary to the variant:added event,
 * this event will give you the complete details of the cart.
 *
 * Example:
 *
 * document.addEventListener('cart:updated', function(event) {
 *   var cart = event.detail.cart; // Get the updated content of the cart
 * });
 *
 * ------------------------------------------------------------------------------------------------------------
 * REFRESH THE CART/MINI-CART
 * ------------------------------------------------------------------------------------------------------------
 *
 * If you are adding variants to the cart and would like to instruct the theme to re-render the cart, you cart
 * send the cart:refresh event, as shown below:
 *
 * document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
 *   bubbles: true
 * }));
 *
 * ------------------------------------------------------------------------------------------------------------
 * USAGE OF CUSTOM ELEMENTS
 * ------------------------------------------------------------------------------------------------------------
 *
 * Our theme makes extensive use of HTML custom elements. Custom elements are an awesome way to extend HTML
 * by creating new elements that carry their own JavaScript for adding new behavior. The theme uses a large
 * number of custom elements, but the two most useful are drawer and popover. Each of those components add
 * a "open" attribute that you can toggle on and off. For instance, let's say you would like to open the cart
 * drawer, whose id is "mini-cart", you simply need to retrieve it and set its "open" attribute to true (or
 * false to close it):
 *
 * document.getElementById('mini-cart').open = true;
 *
 * Thanks to the power of custom elements, the theme will take care automagically of trapping focus, maintaining
 * proper accessibility attributes...
 *
 * If you would like to create your own drawer, you can re-use the <drawer-content> content. Here is a simple
 * example:
 *
 * // Make sure you add "aria-controls", "aria-expanded" and "is" HTML attributes to your button:
 * <button type="button" is="toggle-button" aria-controls="id-of-drawer" aria-expanded="false">Open drawer</button>
 *
 * <drawer-content id="id-of-drawer">
 *   Your content
 * </drawer-content>
 *
 * The nice thing with custom elements is that you do not actually need to instantiate JavaScript yourself: this
 * is done automatically as soon as the element is inserted to the DOM.
 *
 * ------------------------------------------------------------------------------------------------------------
 * THEME DEPENDENCIES
 * ------------------------------------------------------------------------------------------------------------
 *
 * While the theme tries to keep outside dependencies as small as possible, the theme still uses third-party code
 * to power some of its features. Here is the list of all dependencies:
 *
 * "vendor.js":
 *
 * The vendor.js contains required dependencies. This file is loaded in parallel of the theme file.
 *
 * - custom-elements polyfill (used for built-in elements on Safari - v1.0.0): https://github.com/ungap/custom-elements
 * - web-animations-polyfill (used for polyfilling WebAnimations on Safari 12, this polyfill will be removed in 1 year - v2.3.2): https://github.com/web-animations/web-animations-js
 * - instant-page (v5.1.0): https://github.com/instantpage/instant.page
 * - tocca (v2.0.9); https://github.com/GianlucaGuarini/Tocca.js/
 * - seamless-scroll-polyfill (v2.0.0): https://github.com/magic-akari/seamless-scroll-polyfill
 *
 * "flickity.js": v2.2.0 (with the "fade" package). Flickity is only loaded on demand if there is a product image
 * carousel on the page. Otherwise it is not loaded.
 *
 * "photoswipe": v4.1.3. PhotoSwipe is only loaded on demand to power the zoom feature on product page. If the zoom
 * feature is disabled, then this script is never loaded.
 */

var ProductItemGalleryApp = (() => {
	var initialize = () => {
		document.querySelectorAll('product-item .color-swatch__item').forEach(element => {
			element.addEventListener('click', () => {
				const mediaId = element.closest('.color-swatch').querySelector('input').getAttribute('data-variant-featured-media');
				const flickityCarousel = element.closest('product-item').querySelector('flickity-carousel');
				if (!flickityCarousel) return;
				const targetImage = flickityCarousel.querySelector(`img[data-media-id="${mediaId}"]`);
				if (!targetImage) return;
				flickityCarousel.select(Array.from(flickityCarousel.querySelectorAll('img')).indexOf(targetImage));
			});
		});

		document.querySelectorAll('product-item [js-status-bar]').forEach(element => {
			const flickityCarousel = element.closest('product-item').querySelector('flickity-carousel');
			const imagesCount = flickityCarousel.querySelectorAll('img').length;
			element.style.setProperty('--handler-left', '0%');
			if (imagesCount < 1) {
				element.style.setProperty('--handler-width', '0%');
			} else {
				element.style.setProperty('--handler-width', `${100/imagesCount}%`);
			}
			flickityCarousel.addEventListener('flickity:slide-changed', (event) => {
  			element.style.setProperty('--handler-left', event.detail * (100/imagesCount) + '%' );
			});
		});
	};
	return {
		init: initialize
	};
})();

var AccordionContainer = (() => {
	var open = (item, container) => {
		container.querySelectorAll('[js-accordion-item]').forEach(eachItem => {
			close(eachItem);
		});
		item.classList.add('open');
		const body = item.querySelector('[js-accordion-item-body]');
		if (body) {
			body.style.maxHeight = body.scrollHeight + 'px';
		}
	}
	var close = (item) => {
		item.classList.remove('open');
		const body = item.querySelector('[js-accordion-item-body]');
		if (body) {
			body.style.maxHeight = '0px';
		}
	}
	var initialize = () => {
		document.querySelectorAll('[js-accordion-container]').forEach(container => {
			container.querySelectorAll('[js-accordion-item]').forEach((item, index) => {
				if (index == 0) {
					open(item, container);
				} else {
					close(item);
				}
				const heading = item.querySelector('[js-accordion-item-heading]');
				if (heading) {
					heading.addEventListener('click', () => {
						if (item.classList.contains('open')) {
							close(item);
						} else {
							open(item, container);
						}
					});
				}
			});
		});
	}
	return {
		init: initialize
	}
})();

var ProductImageDescription = (() => {
	var changeDescription = (index, container) => {
		if (!container) return;
		
		container.querySelectorAll('[js-product-image-description]').forEach(elementWrapper => {
			elementWrapper.querySelectorAll('[data-index]').forEach(element => {
				element.classList.remove('active');
				if (element.getAttribute('data-index') == String(index)) {
					element.classList.add('active');
				}
			});
		});
	}

	var openModal = (modal) => {
		if (!modal) return;
		modal.classList.add('open');
	}
	var closeModal = (modal) => {
		if (!modal) return;
		modal.classList.remove('open');
		pauseVideo(modal.closest('[js-container]').querySelector('[js-sizeguide-video-wrapper]'));
	}
	var goToSizeVariants = (modal) => {
		closeModal(modal);
		setTimeout(() => {
			const sizeVariantsWrapper = document.querySelector('.product-form__option-selector[data-selector-type="block"]');
			if (sizeVariantsWrapper) {
				window.scrollTo(0, sizeVariantsWrapper.offsetTop - 100);
			}
		}, 300);
	}

	var playVideo = (videoWrapper) => {
		if (!videoWrapper) return;
		const video = videoWrapper.querySelector('video');
		if (!video) return;
		videoWrapper.classList.add('playing');
		video.play();
	}
	var pauseVideo = (videoWrapper) => {
		if (!videoWrapper) return;
		const video = videoWrapper.querySelector('video');
		if (!video) return;
		videoWrapper.classList.remove('playing');
		video.pause();
	}
	var updateTimeLeftVideo = (videoWrapper, video) => {
		if (!videoWrapper || !video) return;
		const leftTimeElement = videoWrapper.querySelector('[js-video-time-left]');
		if (!leftTimeElement) return;
		leftTimeElement.innerHTML = formatTime(parseInt(video.duration) - parseInt(video.currentTime));
		if (video.duration - video.currentTime == 0) {
			setTimeout(() => {
				playVideo(videoWrapper);
				pauseVideo(videoWrapper);
			}, 1000);
		}
	}
	var formatTime = (seconds) => {
		if (seconds<0) return '00:00';
		let minutes = parseInt(seconds / 60);
		if (minutes < 10) minutes = '0' + minutes;
		seconds = seconds % 60;
		if (seconds < 10) seconds = '0' + seconds;
		return minutes + ':' + seconds;
	}

	var openLoadMore = (loadMoreWrapper) => {
		if (!loadMoreWrapper) return;
		const loadMoreContent = loadMoreWrapper.querySelector('[js-load-more-content]');
		if (!loadMoreContent) return;
		loadMoreContent.style.maxHeight = loadMoreContent.scrollHeight + 'px';
		loadMoreWrapper.classList.add('open');
	}
	var closeLoadMore = (loadMoreWrapper) => {
		if (!loadMoreWrapper) return;
		const loadMoreContent = loadMoreWrapper.querySelector('[js-load-more-content]');
		if (!loadMoreContent) return;
		loadMoreContent.style.maxHeight = '0px';
		loadMoreWrapper.classList.remove('open');
	}

	var initialize = () => {
		document.querySelectorAll('[js-container] [js-sizeguide-modal-trigger]').forEach(element => {
			element.addEventListener('click', () => {
				openModal(element.closest('[js-container]').querySelector('[js-sizeguide-modal]'));
			});
		});
		document.querySelectorAll('[js-sizeguide-modal] [js-close]').forEach(element => {
			element.addEventListener('click', () => {
				closeModal(element.closest('[js-sizeguide-modal]'));
			});
		});
		document.querySelectorAll('[js-sizeguide-modal] [js-anchor-button]').forEach(element => {
			element.addEventListener('click', () => {
				goToSizeVariants(element.closest('[js-sizeguide-modal]'));
			});
		});
		document.querySelectorAll('[js-sizeguide-video-wrapper][js-video-trigger]').forEach(element => {
			element.addEventListener('click', () => {
				if (element.classList.contains('playing')) {
					pauseVideo(element);
				} else {
					playVideo(element);
				}
			});
		});
		document.querySelectorAll('[js-sizeguide-video-wrapper] video').forEach(element => {
			element.addEventListener('timeupdate', () => {
				updateTimeLeftVideo(element.closest('[js-sizeguide-video-wrapper]'), element);
			});
		});
		document.querySelectorAll('[js-load-more-wrapper] [js-trigger-load-more]').forEach(element => {
			element.addEventListener('click', () => {
				if (element.closest('[js-load-more-wrapper]').classList.contains('open'))
					closeLoadMore(element.closest('[js-load-more-wrapper]'));
				else
					openLoadMore(element.closest('[js-load-more-wrapper]'));
			});
		});
	}
	return {
		change: changeDescription,
		init: initialize
	}
})();

var BDCustomSliderApp = (() => {
	var onScroll = (container) => {
		if (!container) return;
		const scrollWrapper = container.querySelector('[js-bd-custom-slider]');
		const nextButton = container.querySelector('[js-next]');
		const prevButton = container.querySelector('[js-prev]');
		if (!scrollWrapper || !nextButton || !prevButton) return;
		if (scrollWrapper.scrollLeft > 0) {
			prevButton.classList.add('active');
		} else {
			prevButton.classList.remove('active');
		}

		if (scrollWrapper.scrollLeft + scrollWrapper.clientWidth < scrollWrapper.scrollWidth) {
			nextButton.classList.add('active');
		} else {
			nextButton.classList.remove('active');
		}
	}
	var move = (container, direction = true) => {
		if (!container) return;
		const scrollWrapper = container.querySelector('[js-bd-custom-slider]');
		const nextButton = container.querySelector('[js-next]');
		const prevButton = container.querySelector('[js-prev]');
		if (!scrollWrapper || !nextButton || !prevButton) return;

		let nextElement;
		if (direction)
			nextElement = (container.querySelector('[js-bd-custom-slider]>.active+*'))?(container.querySelector('[js-bd-custom-slider]>.active+*')):(container.querySelector('[js-bd-custom-slider]>*:nth-of-type(2)'));
		else
			nextElement = (container.querySelector('[js-bd-custom-slider]>*:has(+.active)'))?(container.querySelector('[js-bd-custom-slider]>*:has(+.active)')):(container.querySelector('[js-bd-custom-slider]>*:nth-of-type(1)'));
		if (!nextElement) return;

		let offsetLeft = parseInt(scrollWrapper.getAttribute('data-offset-left'));
		if (!Number.isInteger(offsetLeft)) offsetLeft = 0;
		scrollWrapper.scrollTo(nextElement.offsetLeft - offsetLeft, 0);
		document.querySelectorAll('[js-bd-custom-slider]>*').forEach(element => {
			element.classList.remove('active');
		});
		nextElement.classList.add('active');
	}
	var initialize = () => {
		document.querySelectorAll('[js-container]:has([js-bd-custom-slider]) [js-next]').forEach(nextButton => {
			nextButton.addEventListener('click', () => {
				if (nextButton.classList.contains('active'))
					move(nextButton.closest('[js-container]'), true);
			});
		});
		document.querySelectorAll('[js-container]:has([js-bd-custom-slider]) [js-prev]').forEach(prevButton => {
			prevButton.addEventListener('click', () => {
				if (prevButton.classList.contains('active'))
					move(prevButton.closest('[js-container]'), false);
			});
		});
		document.querySelectorAll('[js-container] [js-bd-custom-slider]').forEach(slider => {
			slider.addEventListener('scroll', () => {
				onScroll(slider.closest('[js-container]'));
			});
		});
	}
	return {
		init: initialize
	}
})();

var hideEmptyColorVariantPicker = () => {
	document.querySelectorAll('.product-form__option-selector .color-swatch-list:not(:has(>*))').forEach(element => {
		element.classList.add('d-none');
	});
}

var App = (() => {
  var initialize = () => {
		ProductItemGalleryApp.init();
		AccordionContainer.init();
		ProductImageDescription.init();
		BDCustomSliderApp.init();
		hideEmptyColorVariantPicker();
	}
	return {
		init: initialize
	}
})();

document.addEventListener('DOMContentLoaded', () => {
	App.init();

	document.querySelectorAll('.product__media-list-wrapper>flickity-carousel').forEach(element => {
		element.addEventListener('flickity:slide-changed', (event) => {
			const selectedElement = element.querySelector('.is-selected[data-original-position]');
			if (selectedElement)
				ProductImageDescription.change(selectedElement.getAttribute('data-original-position'), event.target.closest('section'));
		});
	});
});

function updateVariantsBadge(currentVariant) {
	if(getNewBadgeDataForColorAndSizeOptions) {
		const hb_NewBadgeDataForColorAndSizeOptions = getNewBadgeDataForColorAndSizeOptions();
		const productVariantsTags = document.querySelectorAll('product-variants');
	  
		const hb_hiddenOnStorefrontVariantsBaseOnColor = hb_NewBadgeDataForColorAndSizeOptions.filter(variant => {
		  return variant.option1 === currentVariant.option1
		})

		const hb_hiddenOnStorefrontVariantsBaseOnSize = hb_NewBadgeDataForColorAndSizeOptions.filter(variant => {
			return variant.option2 === currentVariant.option2
		})
	  
		productVariantsTags?.forEach((productVariantsTag) => {
		  hb_hiddenOnStorefrontVariantsBaseOnColor.forEach((variant) => {
			  const SizeInputOptionsTags = productVariantsTag.querySelectorAll('.block-swatch-list');
			  SizeInputOptionsTags?.forEach(SizeInputOptionsTag => {

				  const hiddenOptionInput = SizeInputOptionsTag.querySelector(`input[value="${variant.option2}"]`);
				  hiddenOptionInput.closest('.block-swatch')?.querySelector('.hb_badge-text__size--option')?.remove();

				  if(variant.sizeBadgeText) {
					  hiddenOptionInput.closest('.block-swatch').insertAdjacentHTML('afterbegin', `<span class="hb_badge-text__size--option">${variant.sizeBadgeText}</span>`);
				  }
			  })
	  
		  })

		  hb_hiddenOnStorefrontVariantsBaseOnSize.forEach((variant) => {
	  
			const colorInputOptionsTags = productVariantsTag.querySelectorAll('.color-swatch-list');
			colorInputOptionsTags?.forEach(colorInputOptionsTag => {
				const hiddenOptionInput = colorInputOptionsTag.querySelector(`input[value="${variant.option1}"]`);
				if (!hiddenOptionInput) return;
				hiddenOptionInput.closest('.color-swatch')?.querySelector('.hb_badge-text__color--option')?.remove();

				if(variant.colorBadgeText) {
					const hiddenOptionInput = colorInputOptionsTag.querySelector(`input[value="${variant.option1}"]`);
					if (!hiddenOptionInput) return;
					hiddenOptionInput.closest('.color-swatch').insertAdjacentHTML('afterbegin', `<span class="hb_badge-text__color--option">${variant.colorBadgeText}</span>`);
				}
			})
	
		  })
		})
  }
}


function updateHiddenVariants(currentVariant, pageLoad) {
	
	if(getHiddenOnStorefrontVariants) {
		const hb_hiddenOnStorefrontVariants = getHiddenOnStorefrontVariants();
		const productVariantsTags = document.querySelectorAll('product-variants');
	  
		const hb_hiddenOnStorefrontVariantsBaseOnColor = hb_hiddenOnStorefrontVariants.filter(variant => {
		  return variant.option1 === currentVariant.option1
		})
	  
		productVariantsTags?.forEach((productVariantsTag) => {
		  hb_hiddenOnStorefrontVariantsBaseOnColor.forEach((variant) => {
	  
			  const SizeInputOptionsTags = productVariantsTag.querySelectorAll('.block-swatch-list');
			  SizeInputOptionsTags?.forEach(SizeInputOptionsTag => {

				const hiddenOptionInput = SizeInputOptionsTag.querySelector(`input[value="${variant.option2}"]`);
				if (hiddenOptionInput && !hiddenOptionInput.closest('.block-swatch').classList.contains('is-disabled')) {
					hiddenOptionInput.closest('.block-swatch').classList.remove('hidden-on-storefront');
				}

				if(variant.hiddenOnStoreFront) {
					const hiddenOptionInput = SizeInputOptionsTag.querySelector(`input[value="${variant.option2}"]`);
					hiddenOptionInput.closest('.block-swatch').classList.add('hidden-on-storefront');
					if(variant.id == currentVariant.id) {
						SizeInputOptionsTag.querySelector('.block-swatch:not(.hidden-on-storefront) input').click();
					}
				}
			  })
	  
			  const SizeSelectOptionsTags = productVariantsTag.querySelectorAll('.combo-box__option-list');
			  SizeSelectOptionsTags?.forEach(SizeSelectOptionsTag => {

				const hiddenOption = SizeSelectOptionsTag.querySelector(`.combo-box__option-item[value="${variant.option2}"]`);
				if (hiddenOption && !hiddenOption.classList.contains('is-disabled')) {
					hiddenOption?.classList.remove('hidden-on-storefront');
				}

				if(variant.hiddenOnStoreFront) {
					const hiddenOption = SizeSelectOptionsTag.querySelector(`.combo-box__option-item[value="${variant.option2}"]`);
					hiddenOption?.classList.add('hidden-on-storefront');
				}
			  })
	  
		  })
		})
	}
 
	if(getHiddenOnStorefrontVariants && getOnlyColors) {
		const hb_hiddenOnStorefrontVariants = getHiddenOnStorefrontVariants();
		const hb_colorList = getOnlyColors();
		const hb_AllunHiddenOnStorefrontVariantsAllColorsWtihAvailable = {};

		hb_colorList.forEach(color => {
			hb_AllunHiddenOnStorefrontVariantsAllColorsWtihAvailable[color] = hb_hiddenOnStorefrontVariants.filter((variant) => {
				if(variant.available === true && variant.hiddenOnStoreFront === false) {
					return variant.option1 === color;
				}
			}) 
		})

		hb_colorList.forEach(color => {

			function disableVariant() {
				if(hb_AllunHiddenOnStorefrontVariantsAllColorsWtihAvailable[color].length === 0) {
					const productVariantsTags = document.querySelectorAll('product-variants');
					productVariantsTags?.forEach((productVariantsTag) => {
	
						const colorInputOptionsTags = productVariantsTag.querySelectorAll('.color-swatch-list');
						colorInputOptionsTags?.forEach(colorInputOptionsTag => {
							const hiddenOptionInput = colorInputOptionsTag.querySelector(`input[value="${color}"]`);
							if (!hiddenOptionInput) return;
							hiddenOptionInput.closest('.color-swatch').classList.add('is-disabled');
						})
	
						const colorSelectOptionsTags = productVariantsTag.querySelectorAll('.combo-box__option-list');
						colorSelectOptionsTags?.forEach(colorSelectOptionsTag => {
							const hiddenOption = colorSelectOptionsTag.querySelector(`.combo-box__option-item[value="${color}"]`);
							hiddenOption?.classList.add('is-disabled');
						})
	
					})
				}
			}

			if(pageLoad) {
				setTimeout(() => {
					disableVariant();
				}, 2000)
			} else {
				disableVariant();
			}
		}) 
	}
	
	preserveSoldOutStyling();
}

function updateHiddenVariantsonPageload(currentVariant) {
	
	if(getHiddenOnStorefrontVariants && getOnlyColors) {
		const hb_hiddenOnStorefrontVariants = getHiddenOnStorefrontVariants();
		const hb_colorList = getOnlyColors();
		const hb_AllunHiddenOnStorefrontVariantsAllColors = {};

		hb_colorList.forEach(color => {
			hb_AllunHiddenOnStorefrontVariantsAllColors[color] = hb_hiddenOnStorefrontVariants.filter((variant) => {
				return variant.option1 === color && variant.hiddenOnStoreFront === false;
			})
		})

		hb_colorList.forEach(color => {

			if(hb_AllunHiddenOnStorefrontVariantsAllColors[color].length === 0) {
				const productVariantsTags = document.querySelectorAll('product-variants');
				productVariantsTags?.forEach((productVariantsTag) => {

					const colorInputOptionsTags = productVariantsTag.querySelectorAll('.color-swatch-list');
					colorInputOptionsTags?.forEach(colorInputOptionsTag => {
						const hiddenOptionInput = colorInputOptionsTag.querySelector(`input[value="${color}"]`);
						if (!hiddenOptionInput) return;
						hiddenOptionInput.closest('.color-swatch').classList.add('hidden-on-storefront');
						if (hiddenOptionInput.checked) {
							setTimeout(() => {
								colorInputOptionsTag.querySelector('.color-swatch:not(.hidden-on-storefront) input').click();
							}, 1000)
						}
					})

					const colorSelectOptionsTags = productVariantsTag.querySelectorAll('.combo-box__option-list');
					colorSelectOptionsTags?.forEach(colorSelectOptionsTag => {
						const hiddenOption = colorSelectOptionsTag.querySelector(`.combo-box__option-item[value="${color}"]`);
						hiddenOption?.classList.add('hidden-on-storefront');
					})

				})
			}

		}) 
	}
	
	// Also preserve sold-out styling after page load processing
	setTimeout(() => {
		preserveSoldOutStyling();
	}, 750);
}

function preserveSoldOutStyling() {
	// Find all color swatches that were initially marked as sold out/disabled by the template
	document.querySelectorAll('.color-swatch-list').forEach(list => {
		// Handle both types of swatches (inputs and links)
		
		// First handle input-based swatches
		list.querySelectorAll('.color-swatch.is-disabled input').forEach(input => {
			// Make sure the parent has the is-disabled class
			input.closest('.color-swatch').classList.add('is-disabled');
		});
		
		// Then handle link-based swatches
		list.querySelectorAll('.color-swatch a').forEach(swatch => {
			// Check for classes on parent
			if (swatch.closest('.color-swatch').classList.contains('is-disabled')) {
				// Ensure the class remains
				swatch.closest('.color-swatch').classList.add('is-disabled');
			} else {
				// Check if this is a sold-out variant by looking at URL parameters or data
				const url = new URL(swatch.href, window.location.origin);
				const variantId = url.searchParams.get('variant');
				
				// If we have variant data available, use it to determine if sold out
				if (window.soldOutVariants && window.soldOutVariants.includes(variantId)) {
					swatch.closest('.color-swatch').classList.add('is-disabled');
				}
			}
		});
		
		// Handle any hidden swatches that should also be disabled
		list.querySelectorAll('.color-swatch.hidden-on-storefront').forEach(swatch => {
			// Hidden swatches are often also disabled
			if (!swatch.classList.contains('is-disabled')) {
				const isAvailable = !(window.unavailableColors && 
					((swatch.querySelector('input') && window.unavailableColors.includes(swatch.querySelector('input').value)) ||
					(swatch.querySelector('a') && window.unavailableColors.includes(swatch.querySelector('a span').textContent.trim()))));
				
				if (!isAvailable) {
					swatch.classList.add('is-disabled');
				}
			}
		});
	});
}

// Initialize soldOutVariants array if the theme doesn't provide it
document.addEventListener('DOMContentLoaded', () => {
	// Create tracking variables for sold-out variants
	window.soldOutVariants = window.soldOutVariants || [];
	window.unavailableColors = window.unavailableColors || [];
	
	// Find all disabled swatches and track their variants
	document.querySelectorAll('.color-swatch.is-disabled').forEach(swatch => {
		// Handle input-based swatches
		const input = swatch.querySelector('input');
		if (input) {
			window.unavailableColors.push(input.value);
		}
		
		// Handle link-based swatches
		const link = swatch.querySelector('a');
		if (link) {
			const url = new URL(link.href, window.location.origin);
			const variantId = url.searchParams.get('variant');
			if (variantId) {
				window.soldOutVariants.push(variantId);
			}
			
			const colorName = link.querySelector('span')?.textContent?.trim();
			if (colorName) {
				window.unavailableColors.push(colorName);
			}
		}
	});
	
	// Run initial preservation
	preserveSoldOutStyling();
});

// Add event listener for variant changes to re-apply styling
document.addEventListener('variant:changed', function(event) {
	let currentVariant = event.detail.variant;
	updateHiddenVariants(currentVariant);
	
	// Run preservation after variant change
	setTimeout(() => {
		preserveSoldOutStyling();
	}, 100);
	
	if(location.pathname.includes('/products/')) {
		newVariantRegistrationForm(currentVariant);
	}
});

document.addEventListener('DOMContentLoaded', () => {
	try {
		const currentVariant = getHbCurrentVariant();
		updateVariantsBadge(currentVariant);
	} catch (error) {
		
	}
});

document.addEventListener('variant:changed', function(event) {
	let currentVariant = event.detail.variant;
	updateVariantsBadge(currentVariant);
});

document.addEventListener('DOMContentLoaded', () => {
	try {
		const currentVariant = getHbCurrentVariant();
		updateHiddenVariants(currentVariant, pageLoad = true);
		updateHiddenVariantsonPageload(currentVariant);
	} catch (error) {
		
	}
});

// Add event listener for variant changes to re-apply styling
document.addEventListener('variant:changed', function(event) {
	let currentVariant = event.detail.variant;
	updateHiddenVariants(currentVariant);
	updateProductMedia(currentVariant.id);;
	
	// Run preservation after variant change
	setTimeout(() => {
		preserveSoldOutStyling();
	}, 100);
	
	if(location.pathname.includes('/products/')) {
		newVariantRegistrationForm(currentVariant);
	}
});

function newVariantRegistrationForm(currentVariant) {
	const registrationForm = document.querySelector('[js-new-variant-registration-form]');
	const mainSubmitBtnWrapper = document.querySelector('[js-pdp-submit-btn]');
	const submitBtnswrapper = document.querySelectorAll('product-payment-container');
	const inStockWrapper = document.querySelector('[js-instock-wrapper]');
	const stickyCta = document.querySelector('product-sticky-form');
	const variantSaleInfo = document.querySelectorAll('[js-varinat-sale-info]');

	// Show/hide based on newVariantNotForSell
	if (newVariantNotForSell) {
		if (newVariantNotForSell[currentVariant.id] === 'true' && registrationForm) {
			registrationForm.classList.remove('hide');
			mainSubmitBtnWrapper.classList.add('hide');
			inStockWrapper.classList.add('hide');
			stickyCta.classList.add('hide');

			submitBtnswrapper.forEach(btn => {
				btn.style.pointerEvents = 'none';
				btn.style.opacity = 0.5;
			});
		} else {
			registrationForm.classList.add('hide');
			mainSubmitBtnWrapper.classList.remove('hide');
			inStockWrapper.classList.remove('hide');
			stickyCta.classList.remove('hide');

			submitBtnswrapper.forEach(btn => {
				btn.style.pointerEvents = 'auto';
				btn.style.opacity = 1;
			});
		}
	}
	if (showVariantSaleText[currentVariant.id] === 'true') {
		variantSaleInfo.forEach(el => {
			el.classList.add('hide');
		});
	}
	else {
		if (newVariantSaleText && newVariantSaleText[currentVariant.id]) {
			variantSaleInfo.forEach(el => {
				el.textContent = newVariantSaleText[currentVariant.id];
				el.classList.remove('hide');

			});
		} else {
			variantSaleInfo.forEach(el => {
				el.classList.add('hide');
			});
		}
	}	
}

var updateProductMedia = (variantId) => {
	if (!variantId) return;
	document.querySelectorAll(`[js-product-media-id]`).forEach(element => {
		if (String(element.getAttribute('js-product-media-id')).includes(String(variantId))) {
			element.classList.add('active');
			const selectedElement = element.querySelector('flickity-carousel .is-selected[data-original-position]');
			if (selectedElement)
				ProductImageDescription.change(selectedElement.getAttribute('data-original-position'), element.closest('section'));
			else if (element.querySelector('flickity-carousel'))
				ProductImageDescription.change(-1, element.closest('section'));
		} else {
			element.classList.remove('active');
		}
	});
}





document.addEventListener('DOMContentLoaded', function() {

	console.log("datora installed .................................")
window.co2CheckApply = window.co2CheckReverse = window.co2ErrorAlert = false;
window.datoraErrors = {};
let co2Initialized = false;
let co2CartUpdate = false;
let co2CheckApply = false;
let co2CheckReverse = false;

const truncate = (str, len = 10) => str.length > len ? str.substring(0, len) + '...' : str;

const priceFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  currencyDisplay: 'symbol'
});

const formatPrice = function(price){
  const formatted = priceFormatter.format(price);
  const [amount, currency] = formatted.toString().split(/%C2%A0|\u00A0/);
  return currency+amount;
}

const applyDatoraDiscount = async function() {
  window.co2CheckApply = window.co2CheckReverse = window.co2ErrorAlert = false;
  const datoraInput = document.querySelector('input[name="datora-discount"][form="datora-form"]') || 
                     document.querySelector('input[name="datora-discount"]');
  if(!datoraInput) return;
  const discountCode = datoraInput.value.trim();
  if(discountCode.length < 1){
    errorDatoraDiscount('show', 'empty');
    return;
  }
  const datoraContainer = datoraInput.closest('.datora-discount-field-container');
  errorDatoraDiscount('hide');
  if(datoraContainer) datoraContainer.classList.add('loading');
  if (typeof co2 !== 'undefined' && typeof co2.setDiscountCode === 'function') {
    window.co2CheckApply = co2CheckApply = discountCode.trim().toUpperCase();
    const getCurrentDiscountCode = await co2.getDiscountCode();
    if(getCurrentDiscountCode){ window.co2CheckReverse = co2CheckReverse = getCurrentDiscountCode; }
    if(getCurrentDiscountCode && getCurrentDiscountCode.trim().toUpperCase() === discountCode.trim().toUpperCase()){
      if(datoraContainer) datoraContainer.classList.remove('loading');
      errorDatoraDiscount('show', 'double', discountCode);
      return;
    }
    const resultChangeDiscountCode = await co2.setDiscountCode(discountCode);
    console.log(resultChangeDiscountCode)
    if(resultChangeDiscountCode){
      const cleanCode = discountCode.trim().toUpperCase();
      sessionStorage.setItem("lastDiscountCode",cleanCode);
      document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true }));
    } else {
      errorDatoraDiscount('show', 'failed', discountCode);
    }
    if(datoraContainer) datoraContainer.classList.remove('loading');
  }else{
    if(datoraContainer) datoraContainer.classList.remove('loading');
  }
};

const removeDatoraDiscount = async function() {
  errorDatoraDiscount('hide');
  const datoraContainer = document.querySelector('.datora-discount-field-container');
  if(datoraContainer) datoraContainer.classList.add('loading');
  const datoraCodeApplied = datoraContainer.querySelectorAll('.applied-discount');
  if (typeof co2 !== 'undefined' && typeof co2.removeDiscountCode === 'function') {
    datoraCodeApplied.forEach(element => {
      const buttonsInElement = element.querySelectorAll('button');
      buttonsInElement.forEach(button => {
          button.disabled = true;
      });
    });
    let resultRemoveDiscountCode = await co2.removeDiscountCode();
    if(resultRemoveDiscountCode){
      sessionStorage.removeItem("lastDiscountCode");
      window.co2CheckApply = window.co2CheckReverse = window.co2ErrorAlert = false;
      document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true }));
      const datoraInput = document.querySelector('input[name="datora-discount"][form="datora-form"]') || 
                          document.querySelector('input[name="datora-discount"]');
      if (datoraInput) datoraInput.value = '';
      if(datoraContainer) datoraContainer.classList.remove('loading');
      document.querySelectorAll('.discounted[data-datora-price]').forEach(div => {
        resetProductGridDiscount(div);
      });
      datoraCodeApplied[0].disabled = false;
    }else{ datoraCodeApplied[0].disabled = false; }
  }
}

function setDatoraClasses(parentElem, fakeComparePrice) {
  parentElem.querySelectorAll('[data-datora-classes]').forEach(elem => {
    const newClasses = elem.dataset.datoraClasses;
    if(newClasses.length === 0) {
      return;
    }
    if(newClasses.includes('price--compare')) {
      elem.querySelector('span:not(.visually-hidden)').textContent = fakeComparePrice;
    }
    elem.setAttribute('class', newClasses);
  });
}

function errorDatoraDiscount(type = 'show', reason = 'invalid', code = '') {
  const cartDrawer = document.querySelector('cart-drawer');
  const datoraContainer = document.querySelector('.datora-discount-field-container');
  if(type == "show"){
    let errorAlert = window.datoraErrors[reason] ?? false;
    if(!errorAlert) return;
    const cleanCode = code.trim().toUpperCase();
    errorAlert = errorAlert.replace("[[CODE]]",truncate(cleanCode,10));
    if(reason != "invalid"){
      if(datoraContainer) datoraContainer.classList.add('error');
      if(reason == "empty"){
        if(datoraContainer) datoraContainer.querySelector('.datora-input input').focus();
      }else if(reason == "double"){
        if(datoraContainer) datoraContainer.querySelector('.datora-input input').value = '';
        if(datoraContainer) datoraContainer.querySelector('.datora-input input').classList.remove('is-filled');
        if(datoraContainer) datoraContainer.querySelector('.datora-input input').focus();
      }
    }else{
      if(cartDrawer) cartDrawer.classList.add('error');
      if(datoraContainer) datoraContainer.querySelector('.datora-input input').value = '';
      if(datoraContainer) datoraContainer.querySelector('.datora-input input').classList.remove('is-filled');
      window.co2ErrorAlert = errorAlert;
    }
    if(datoraContainer) datoraContainer.querySelector('.datora-discount-error span').innerHTML = errorAlert;
  }else{
    event.preventDefault();
    if(cartDrawer) cartDrawer.classList.remove('error');
    if(datoraContainer) datoraContainer.classList.remove('error');
  }
}

function resetProductGridDiscount(div){
  div.classList.remove('discounted');
  const oldPrice = div.dataset.datoraPrice;
  const oldCompare = div.dataset.datoraCompare;
  const oldCompareCheck = (oldCompare && oldCompare != "") ? parseInt(oldCompare) : 0;
  let priceClass = "";
  const productMeta = div.closest('product-meta');
  if(productMeta){
    const productMetaPriceClass = productMeta.getAttribute("price-class");
    if(productMetaPriceClass){
      priceClass = productMetaPriceClass;
    }
  }
  if(oldCompareCheck == 0){
    if (div.querySelector('.price--highlight')){
      div.querySelector('.price--highlight').classList.remove('price--highlight');
    }
    if (div.querySelector('.price--compare')){
      div.querySelector('.price--compare').classList.add('hidden');
    }
  }
  const basePriceFormatted = formatPrice(oldPrice / 100);
  div.querySelector('.price-list .price:not(.price--compare) span:not(.visually-hidden)').textContent = basePriceFormatted;
  if(priceClass != ""){
    div.querySelector('.price-list .price:not(.price--compare) span:not(.visually-hidden)').classList.add(priceClass);
  }
  const datoraInfo = div.querySelector('[data-datora]');
  if (datoraInfo) datoraInfo.textContent = '';
  const badge = div.querySelector('.datora.discount-badge');
  if (badge) badge.setAttribute('hidden', true);
}

function updateProductGridDiscounts() {
  if (typeof co2 === 'undefined' || typeof co2.getDiscountCode !== 'function') {
    return Promise.resolve();
  }
  return co2.getDiscountCode().then(getDiscountCode => {
    if (!getDiscountCode) {
      return Promise.resolve();
    }
    const promises = Array.from(document.querySelectorAll('[data-datora-pid]')).map(div => {
      let validDisc = false;
      let newPrice, badgeText;
      const [vid, pid, spgid, tags, price, compare] = [
        div.dataset.datoraVid,
        div.dataset.datoraPid,
        div.dataset.datoraSpgid,
        div.dataset.datoraTags,
        div.dataset.datoraPrice,
        div.dataset.datoraCompare
      ];
      if (!(vid && pid && price)) return Promise.resolve();
      let metaPriceClass = "";
      let metaFormId = "";
      const productMeta = div.closest('product-meta');
      if(productMeta){
        const productMetaPriceClass = productMeta.getAttribute("price-class");
        if(productMetaPriceClass){
          metaPriceClass = productMetaPriceClass;
        }
        const productMetaFormId = productMeta.getAttribute("form-id");
        if(productMetaFormId){
          metaFormId = productMetaFormId;
        }
      }
      return co2.itemDiscountFull(Number(pid), Number(vid), tags ? tags.split(',') : [], Number(price), 1, spgid === "" || "false" ? null : spgid)
        .then(data => {
          const basePriceFormatted = formatPrice(price / 100);
          if(data){
            if (data.calc === "perc" && data.discPerc > 0) {
              validDisc = true;
              const discountedPrice = price - price * data.discPerc / 100;
              newPrice = formatPrice(discountedPrice / 100);
              const discountValue = price * data.discPerc / 100;
              const formattedDiscountValue = formatPrice(discountValue / 100);
              //badgeText = `-${data.discPerc}% (${formattedDiscountValue}) ${getDiscountCode.toUpperCase()}`;
              badgeText = `<b>-${data.discPerc}%</b> (${getDiscountCode.toUpperCase()})`;
            } else if (data.calc === "amt" && data.discAmt > 0) {
              validDisc = true;
              const discountedPrice = price - data.discAmt * 100;
              newPrice = formatPrice(discountedPrice / 100);
              const discountValue = price - discountedPrice;
              const formattedDiscountValue = formatPrice(discountValue / 100);
              //badgeText = `(-${formattedDiscountValue}) ${getDiscountCode.toUpperCase()}`;
              badgeText = `-${formattedDiscountValue} | ${getDiscountCode.toUpperCase()}`;
            }
            if(validDisc){
              div.classList.add('discounted');
              div.querySelector('.price-list .price:not(.price--compare) span:not(.visually-hidden)').textContent = newPrice;
              if(metaPriceClass != ""){
                div.querySelector('.price-list .price:not(.price--compare) span:not(.visually-hidden)').classList.add(metaPriceClass);
              }
              if(metaFormId && document.querySelector("product-sticky-form[form-id='"+metaFormId+"']")){
                document.querySelector("product-sticky-form[form-id='"+metaFormId+"'] .product-sticky-form__price span:not(.visually-hidden)").textContent = newPrice;
              }
              const originalPriceAsComparePrice = formatPrice(price / 100);
              setDatoraClasses(div, originalPriceAsComparePrice);
              div.querySelector('[data-datora]').innerHTML = badgeText;
              const badge = div.querySelector('.datora.discount-badge');
              if (badge) badge.removeAttribute('hidden');
            }else{
              resetProductGridDiscount(div);
            }
          }else{
            resetProductGridDiscount(div);
          }
        })
        .catch(error => {
          console.error('Error processing discount:', error);
        });
    });
    return Promise.all(promises);
  });
}

async function checkDiscountCode() {
  const sessionStorage_code 	= sessionStorage.getItem("lastDiscountCode");
  const getCurrentDiscountCode = await co2.getDiscountCode();
  if(getCurrentDiscountCode){
    const cleanCode 			= getCurrentDiscountCode.trim().toUpperCase();
    if(sessionStorage_code ===  null || cleanCode != sessionStorage_code){
      sessionStorage.setItem("lastDiscountCode", cleanCode);
      window.dispatchEvent(new CustomEvent('co2.codelink'));
    }
  }
}

window.addEventListener('co2.cart.initialized', function() {
  if(!co2Initialized){
    updateProductGridDiscounts();
    checkDiscountCode();
    console.log("EventListener: co2.cart.initialized");
    const cartDrawer = document.querySelector('cart-drawer');
    const datoraContainer = cartDrawer.querySelector('.datora-discount-field-container');
    if(datoraContainer){
      window.datoraErrors.empty = datoraContainer.dataset.errorEmpty ?? "";
      window.datoraErrors.double = datoraContainer.dataset.errorDouble ?? "";
      window.datoraErrors.failed = datoraContainer.dataset.errorFailed ?? "";
      window.datoraErrors.invalid = datoraContainer.dataset.errorInvalid ?? "";
      console.log("window.datoraErrors", window.datoraErrors);
    }
    co2Initialized = true;
  }
});

window.addEventListener('co2.codelink', async function(event){
  console.log("EventListener: co2.codelink");
  const successDiscountBar = document.querySelector("#successDiscountBar");
  if(successDiscountBar){
    const getCurrentDiscountCode = await co2.getDiscountCode();
    if(getCurrentDiscountCode){
      const cleanCode = getCurrentDiscountCode.trim().toUpperCase();
      sessionStorage.setItem("lastDiscountCode", cleanCode);
      const successTextElm = successDiscountBar.querySelector("span");
      const successTextElmData = successTextElm.getAttribute("data-text");
      const addSuccessText = successTextElmData.replace("[[CODE]]",cleanCode);
      successTextElm.innerHTML = addSuccessText;
      successDiscountBar.classList.add('show');
      setTimeout(() => { successDiscountBar.classList.remove('show') }, 3500);
      document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true }));
    }
  }
});

window.addEventListener('co2.discountCodeSet', function(event){
  updateProductGridDiscounts();
  console.log("EventListener: co2.discountCodeSet");
});

window.addEventListener('variant:changed', function(event){
  updateProductGridDiscounts();
  console.log("EventListener: variant:changed");
});

document.documentElement.addEventListener('cart:refresh', async (result) => {
  let updateProductGrid = true;
  console.log(result);
  if(co2Initialized){
    console.log("EventListener: cart:refresh", co2CheckApply);
    if(co2CheckApply){
      const cartContent = await (await fetch(`${window.themeVariables.routes.cartUrl}.js`, {cache: 'reload'})).json();
      //console.log("cartContent", cartContent, cartContent.discount_codes, cartContent.discount_codes.length);
      if(cartContent && cartContent.discount_codes && cartContent.discount_codes.length >= 1){
        if(cartContent.discount_codes[0]){
          const cartDiscount = (cartContent.discount_codes[0].code) ? cartContent.discount_codes[0].code.trim().toUpperCase() : false;
          //console.log("CHECK", cartDiscount, co2CheckApply, cartContent.discount_codes[0].applicable);
          if(cartDiscount && cartDiscount == co2CheckApply && !cartContent.discount_codes[0].applicable){
            console.log("co2CheckApply faild");
            co2CheckApply = updateProductGrid = false;
            errorDatoraDiscount('show', 'invalid', cartDiscount);
            if(co2CheckReverse){
              const resultChangeDiscountCode = await co2.setDiscountCode(co2CheckReverse);
              if(resultChangeDiscountCode){
                const cleanCode = co2CheckReverse.trim().toUpperCase();
                sessionStorage.setItem("lastDiscountCode",cleanCode);
                document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true }));
              }
              co2CheckReverse = false;
            }
          }
        }
      }
    }
    if(updateProductGrid) updateProductGridDiscounts();
  }else{
    co2CartUpdate = true;
  }
});
})
