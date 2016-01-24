/* ng-infinite-scroll - v1.0.0 - 2013-02-23 */
var mod;

mod = angular.module('infinite-scroll', []);

mod.directive('infiniteScroll', [
  '$rootScope', '$window', '$timeout', function($rootScope, $window, $timeout) {
    return {
      link: function(scope, elem, attrs) {
        var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
        $window = angular.element($window);
        scrollDistance = 0;
        if (attrs.infiniteScrollDistance != null) {
          scope.$watch(attrs.infiniteScrollDistance, function(value) {
            return scrollDistance = parseInt(value, 10);
          });
        }
        scrollEnabled = true;
        checkWhenEnabled = false;
        if (attrs.infiniteScrollDisabled != null) {
          scope.$watch(attrs.infiniteScrollDisabled, function(value) {
            scrollEnabled = !value;
            if (scrollEnabled && checkWhenEnabled) {
              checkWhenEnabled = false;
              return handler();
            }
          });
        }
        handler = function() {
          var elementBottom, remaining, shouldScroll, windowBottom;
          windowBottom = $window.height() + $window.scrollTop();
          elementBottom = elem.offset().top + elem.height();
          remaining = elementBottom - windowBottom;
          shouldScroll = remaining <= $window.height() * scrollDistance;
          if (shouldScroll && scrollEnabled) {
            if ($rootScope.$$phase) {
              return scope.$eval(attrs.infiniteScroll);
            } else {
              return scope.$apply(attrs.infiniteScroll);
            }
          } else if (shouldScroll) {
            return checkWhenEnabled = true;
          }
        };
        $window.on('scroll', handler);
        scope.$on('$destroy', function() {
          return $window.off('scroll', handler);
        });
        return $timeout((function() {
          if (attrs.infiniteScrollImmediateCheck) {
            if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
              return handler();
            }
          } else {
            return handler();
          }
        }), 0);
      }
    };
  }
]);

/**
 * @license AngularJS v1.3.0-beta.3
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

/* jshint maxlen: false */

/**
 * @ngdoc module
 * @name ngAnimate
 * @description
 *
 * # ngAnimate
 *
 * The `ngAnimate` module provides support for JavaScript, CSS3 transition and CSS3 keyframe animation hooks within existing core and custom directives.
 *
 *
 * <div doc-module-components="ngAnimate"></div>
 *
 * # Usage
 *
 * To see animations in action, all that is required is to define the appropriate CSS classes
 * or to register a JavaScript animation via the myModule.animation() function. The directives that support animation automatically are:
 * `ngRepeat`, `ngInclude`, `ngIf`, `ngSwitch`, `ngShow`, `ngHide`, `ngView` and `ngClass`. Custom directives can take advantage of animation
 * by using the `$animate` service.
 *
 * Below is a more detailed breakdown of the supported animation events provided by pre-existing ng directives:
 *
 * | Directive                                                 | Supported Animations                               |
 * |---------------------------------------------------------- |----------------------------------------------------|
 * | {@link ng.directive:ngRepeat#usage_animations ngRepeat}         | enter, leave and move                              |
 * | {@link ngRoute.directive:ngView#usage_animations ngView}        | enter and leave                                    |
 * | {@link ng.directive:ngInclude#usage_animations ngInclude}       | enter and leave                                    |
 * | {@link ng.directive:ngSwitch#usage_animations ngSwitch}         | enter and leave                                    |
 * | {@link ng.directive:ngIf#usage_animations ngIf}                 | enter and leave                                    |
 * | {@link ng.directive:ngClass#usage_animations ngClass}           | add and remove                                     |
 * | {@link ng.directive:ngShow#usage_animations ngShow & ngHide}    | add and remove (the ng-hide class value)           |
 * | {@link ng.directive:form#usage_animations form}                 | add and remove (dirty, pristine, valid, invalid & all other validations)                |
 * | {@link ng.directive:ngModel#usage_animations ngModel}           | add and remove (dirty, pristine, valid, invalid & all other validations)                |
 *
 * You can find out more information about animations upon visiting each directive page.
 *
 * Below is an example of how to apply animations to a directive that supports animation hooks:
 *
 * ```html
 * <style type="text/css">
 * .slide.ng-enter, .slide.ng-leave {
 *   -webkit-transition:0.5s linear all;
 *   transition:0.5s linear all;
 * }
 *
 * .slide.ng-enter { }        /&#42; starting animations for enter &#42;/
 * .slide.ng-enter-active { } /&#42; terminal animations for enter &#42;/
 * .slide.ng-leave { }        /&#42; starting animations for leave &#42;/
 * .slide.ng-leave-active { } /&#42; terminal animations for leave &#42;/
 * </style>
 *
 * <!--
 * the animate service will automatically add .ng-enter and .ng-leave to the element
 * to trigger the CSS transition/animations
 * -->
 * <ANY class="slide" ng-include="..."></ANY>
 * ```
 *
 * Keep in mind that if an animation is running, any child elements cannot be animated until the parent element's
 * animation has completed.
 *
 * <h2>CSS-defined Animations</h2>
 * The animate service will automatically apply two CSS classes to the animated element and these two CSS classes
 * are designed to contain the start and end CSS styling. Both CSS transitions and keyframe animations are supported
 * and can be used to play along with this naming structure.
 *
 * The following code below demonstrates how to perform animations using **CSS transitions** with Angular:
 *
 * ```html
 * <style type="text/css">
 * /&#42;
 *  The animate class is apart of the element and the ng-enter class
 *  is attached to the element once the enter animation event is triggered
 * &#42;/
 * .reveal-animation.ng-enter {
 *  -webkit-transition: 1s linear all; /&#42; Safari/Chrome &#42;/
 *  transition: 1s linear all; /&#42; All other modern browsers and IE10+ &#42;/
 *
 *  /&#42; The animation preparation code &#42;/
 *  opacity: 0;
 * }
 *
 * /&#42;
 *  Keep in mind that you want to combine both CSS
 *  classes together to avoid any CSS-specificity
 *  conflicts
 * &#42;/
 * .reveal-animation.ng-enter.ng-enter-active {
 *  /&#42; The animation code itself &#42;/
 *  opacity: 1;
 * }
 * </style>
 *
 * <div class="view-container">
 *   <div ng-view class="reveal-animation"></div>
 * </div>
 * ```
 *
 * The following code below demonstrates how to perform animations using **CSS animations** with Angular:
 *
 * ```html
 * <style type="text/css">
 * .reveal-animation.ng-enter {
 *   -webkit-animation: enter_sequence 1s linear; /&#42; Safari/Chrome &#42;/
 *   animation: enter_sequence 1s linear; /&#42; IE10+ and Future Browsers &#42;/
 * }
 * &#64-webkit-keyframes enter_sequence {
 *   from { opacity:0; }
 *   to { opacity:1; }
 * }
 * &#64keyframes enter_sequence {
 *   from { opacity:0; }
 *   to { opacity:1; }
 * }
 * </style>
 *
 * <div class="view-container">
 *   <div ng-view class="reveal-animation"></div>
 * </div>
 * ```
 *
 * Both CSS3 animations and transitions can be used together and the animate service will figure out the correct duration and delay timing.
 *
 * Upon DOM mutation, the event class is added first (something like `ng-enter`), then the browser prepares itself to add
 * the active class (in this case `ng-enter-active`) which then triggers the animation. The animation module will automatically
 * detect the CSS code to determine when the animation ends. Once the animation is over then both CSS classes will be
 * removed from the DOM. If a browser does not support CSS transitions or CSS animations then the animation will start and end
 * immediately resulting in a DOM element that is at its final state. This final state is when the DOM element
 * has no CSS transition/animation classes applied to it.
 *
 * <h3>CSS Staggering Animations</h3>
 * A Staggering animation is a collection of animations that are issued with a slight delay in between each successive operation resulting in a
 * curtain-like effect. The ngAnimate module, as of 1.2.0, supports staggering animations and the stagger effect can be
 * performed by creating a **ng-EVENT-stagger** CSS class and attaching that class to the base CSS class used for
 * the animation. The style property expected within the stagger class can either be a **transition-delay** or an
 * **animation-delay** property (or both if your animation contains both transitions and keyframe animations).
 *
 * ```css
 * .my-animation.ng-enter {
 *   /&#42; standard transition code &#42;/
 *   -webkit-transition: 1s linear all;
 *   transition: 1s linear all;
 *   opacity:0;
 * }
 * .my-animation.ng-enter-stagger {
 *   /&#42; this will have a 100ms delay between each successive leave animation &#42;/
 *   -webkit-transition-delay: 0.1s;
 *   transition-delay: 0.1s;
 *
 *   /&#42; in case the stagger doesn't work then these two values
 *    must be set to 0 to avoid an accidental CSS inheritance &#42;/
 *   -webkit-transition-duration: 0s;
 *   transition-duration: 0s;
 * }
 * .my-animation.ng-enter.ng-enter-active {
 *   /&#42; standard transition styles &#42;/
 *   opacity:1;
 * }
 * ```
 *
 * Staggering animations work by default in ngRepeat (so long as the CSS class is defined). Outside of ngRepeat, to use staggering animations
 * on your own, they can be triggered by firing multiple calls to the same event on $animate. However, the restrictions surrounding this
 * are that each of the elements must have the same CSS className value as well as the same parent element. A stagger operation
 * will also be reset if more than 10ms has passed after the last animation has been fired.
 *
 * The following code will issue the **ng-leave-stagger** event on the element provided:
 *
 * ```js
 * var kids = parent.children();
 *
 * $animate.leave(kids[0]); //stagger index=0
 * $animate.leave(kids[1]); //stagger index=1
 * $animate.leave(kids[2]); //stagger index=2
 * $animate.leave(kids[3]); //stagger index=3
 * $animate.leave(kids[4]); //stagger index=4
 *
 * $timeout(function() {
 *   //stagger has reset itself
 *   $animate.leave(kids[5]); //stagger index=0
 *   $animate.leave(kids[6]); //stagger index=1
 * }, 100, false);
 * ```
 *
 * Stagger animations are currently only supported within CSS-defined animations.
 *
 * <h2>JavaScript-defined Animations</h2>
 * In the event that you do not want to use CSS3 transitions or CSS3 animations or if you wish to offer animations on browsers that do not
 * yet support CSS transitions/animations, then you can make use of JavaScript animations defined inside of your AngularJS module.
 *
 * ```js
 * //!annotate="YourApp" Your AngularJS Module|Replace this or ngModule with the module that you used to define your application.
 * var ngModule = angular.module('YourApp', ['ngAnimate']);
 * ngModule.animation('.my-crazy-animation', function() {
 *   return {
 *     enter: function(element, done) {
 *       //run the animation here and call done when the animation is complete
 *       return function(cancelled) {
 *         //this (optional) function will be called when the animation
 *         //completes or when the animation is cancelled (the cancelled
 *         //flag will be set to true if cancelled).
 *       };
 *     },
 *     leave: function(element, done) { },
 *     move: function(element, done) { },
 *
 *     //animation that can be triggered before the class is added
 *     beforeAddClass: function(element, className, done) { },
 *
 *     //animation that can be triggered after the class is added
 *     addClass: function(element, className, done) { },
 *
 *     //animation that can be triggered before the class is removed
 *     beforeRemoveClass: function(element, className, done) { },
 *
 *     //animation that can be triggered after the class is removed
 *     removeClass: function(element, className, done) { }
 *   };
 * });
 * ```
 *
 * JavaScript-defined animations are created with a CSS-like class selector and a collection of events which are set to run
 * a javascript callback function. When an animation is triggered, $animate will look for a matching animation which fits
 * the element's CSS class attribute value and then run the matching animation event function (if found).
 * In other words, if the CSS classes present on the animated element match any of the JavaScript animations then the callback function will
 * be executed. It should be also noted that only simple, single class selectors are allowed (compound class selectors are not supported).
 *
 * Within a JavaScript animation, an object containing various event callback animation functions is expected to be returned.
 * As explained above, these callbacks are triggered based on the animation event. Therefore if an enter animation is run,
 * and the JavaScript animation is found, then the enter callback will handle that animation (in addition to the CSS keyframe animation
 * or transition code that is defined via a stylesheet).
 *
 */

angular.module('ngAnimate', ['ng'])

  /**
   * @ngdoc provider
   * @name $animateProvider
   * @description
   *
   * The `$animateProvider` allows developers to register JavaScript animation event handlers directly inside of a module.
   * When an animation is triggered, the $animate service will query the $animate service to find any animations that match
   * the provided name value.
   *
   * Requires the {@link ngAnimate `ngAnimate`} module to be installed.
   *
   * Please visit the {@link ngAnimate `ngAnimate`} module overview page learn more about how to use animations in your application.
   *
   */

  //this private service is only used within CSS-enabled animations
  //IE8 + IE9 do not support rAF natively, but that is fine since they
  //also don't support transitions and keyframes which means that the code
  //below will never be used by the two browsers.
  .factory('$$animateReflow', ['$$rAF', '$document', function($$rAF, $document) {
    var bod = $document[0].body;
    return function(fn) {
      //the returned function acts as the cancellation function
      return $$rAF(function() {
        //the line below will force the browser to perform a repaint
        //so that all the animated elements within the animation frame
        //will be properly updated and drawn on screen. This is
        //required to perform multi-class CSS based animations with
        //Firefox. DO NOT REMOVE THIS LINE.
        var a = bod.offsetWidth + 1;
        fn();
      });
    };
  }])

  .config(['$provide', '$animateProvider', function($provide, $animateProvider) {
    var noop = angular.noop;
    var forEach = angular.forEach;
    var selectors = $animateProvider.$$selectors;

    var ELEMENT_NODE = 1;
    var NG_ANIMATE_STATE = '$$ngAnimateState';
    var NG_ANIMATE_CLASS_NAME = 'ng-animate';
    var rootAnimateState = {running: true};

    function extractElementNode(element) {
      for(var i = 0; i < element.length; i++) {
        var elm = element[i];
        if(elm.nodeType == ELEMENT_NODE) {
          return elm;
        }
      }
    }

    function stripCommentsFromElement(element) {
      return angular.element(extractElementNode(element));
    }

    function isMatchingElement(elm1, elm2) {
      return extractElementNode(elm1) == extractElementNode(elm2);
    }

    $provide.decorator('$animate', ['$delegate', '$injector', '$sniffer', '$rootElement', '$$asyncCallback', '$rootScope', '$document',
                            function($delegate,   $injector,   $sniffer,   $rootElement,   $$asyncCallback,    $rootScope,   $document) {

      var globalAnimationCounter = 0;
      $rootElement.data(NG_ANIMATE_STATE, rootAnimateState);

      // disable animations during bootstrap, but once we bootstrapped, wait again
      // for another digest until enabling animations. The reason why we digest twice
      // is because all structural animations (enter, leave and move) all perform a
      // post digest operation before animating. If we only wait for a single digest
      // to pass then the structural animation would render its animation on page load.
      // (which is what we're trying to avoid when the application first boots up.)
      $rootScope.$$postDigest(function() {
        $rootScope.$$postDigest(function() {
          rootAnimateState.running = false;
        });
      });

      var classNameFilter = $animateProvider.classNameFilter();
      var isAnimatableClassName = !classNameFilter
              ? function() { return true; }
              : function(className) {
                return classNameFilter.test(className);
              };

      function lookup(name) {
        if (name) {
          var matches = [],
              flagMap = {},
              classes = name.substr(1).split('.');

          //the empty string value is the default animation
          //operation which performs CSS transition and keyframe
          //animations sniffing. This is always included for each
          //element animation procedure if the browser supports
          //transitions and/or keyframe animations
          if ($sniffer.transitions || $sniffer.animations) {
            classes.push('');
          }

          for(var i=0; i < classes.length; i++) {
            var klass = classes[i],
                selectorFactoryName = selectors[klass];
            if(selectorFactoryName && !flagMap[klass]) {
              matches.push($injector.get(selectorFactoryName));
              flagMap[klass] = true;
            }
          }
          return matches;
        }
      }

      function animationRunner(element, animationEvent, className) {
        //transcluded directives may sometimes fire an animation using only comment nodes
        //best to catch this early on to prevent any animation operations from occurring
        var node = element[0];
        if(!node) {
          return;
        }

        var isSetClassOperation = animationEvent == 'setClass';
        var isClassBased = isSetClassOperation ||
                           animationEvent == 'addClass' ||
                           animationEvent == 'removeClass';

        var classNameAdd, classNameRemove;
        if(angular.isArray(className)) {
          classNameAdd = className[0];
          classNameRemove = className[1];
          className = classNameAdd + ' ' + classNameRemove;
        }

        var currentClassName = element.attr('class');
        var classes = currentClassName + ' ' + className;
        if(!isAnimatableClassName(classes)) {
          return;
        }

        var beforeComplete = noop,
            beforeCancel = [],
            before = [],
            afterComplete = noop,
            afterCancel = [],
            after = [];

        var animationLookup = (' ' + classes).replace(/\s+/g,'.');
        forEach(lookup(animationLookup), function(animationFactory) {
          var created = registerAnimation(animationFactory, animationEvent);
          if(!created && isSetClassOperation) {
            registerAnimation(animationFactory, 'addClass');
            registerAnimation(animationFactory, 'removeClass');
          }
        });

        function registerAnimation(animationFactory, event) {
          var afterFn = animationFactory[event];
          var beforeFn = animationFactory['before' + event.charAt(0).toUpperCase() + event.substr(1)];
          if(afterFn || beforeFn) {
            if(event == 'leave') {
              beforeFn = afterFn;
              //when set as null then animation knows to skip this phase
              afterFn = null;
            }
            after.push({
              event : event, fn : afterFn
            });
            before.push({
              event : event, fn : beforeFn
            });
            return true;
          }
        }

        function run(fns, cancellations, allCompleteFn) {
          var animations = [];
          forEach(fns, function(animation) {
            animation.fn && animations.push(animation);
          });

          var count = 0;
          function afterAnimationComplete(index) {
            if(cancellations) {
              (cancellations[index] || noop)();
              if(++count < animations.length) return;
              cancellations = null;
            }
            allCompleteFn();
          }

          //The code below adds directly to the array in order to work with
          //both sync and async animations. Sync animations are when the done()
          //operation is called right away. DO NOT REFACTOR!
          forEach(animations, function(animation, index) {
            var progress = function() {
              afterAnimationComplete(index);
            };
            switch(animation.event) {
              case 'setClass':
                cancellations.push(animation.fn(element, classNameAdd, classNameRemove, progress));
                break;
              case 'addClass':
                cancellations.push(animation.fn(element, classNameAdd || className,     progress));
                break;
              case 'removeClass':
                cancellations.push(animation.fn(element, classNameRemove || className,  progress));
                break;
              default:
                cancellations.push(animation.fn(element, progress));
                break;
            }
          });

          if(cancellations && cancellations.length === 0) {
            allCompleteFn();
          }
        }

        return {
          node : node,
          event : animationEvent,
          className : className,
          isClassBased : isClassBased,
          isSetClassOperation : isSetClassOperation,
          before : function(allCompleteFn) {
            beforeComplete = allCompleteFn;
            run(before, beforeCancel, function() {
              beforeComplete = noop;
              allCompleteFn();
            });
          },
          after : function(allCompleteFn) {
            afterComplete = allCompleteFn;
            run(after, afterCancel, function() {
              afterComplete = noop;
              allCompleteFn();
            });
          },
          cancel : function() {
            if(beforeCancel) {
              forEach(beforeCancel, function(cancelFn) {
                (cancelFn || noop)(true);
              });
              beforeComplete(true);
            }
            if(afterCancel) {
              forEach(afterCancel, function(cancelFn) {
                (cancelFn || noop)(true);
              });
              afterComplete(true);
            }
          }
        };
      }

      /**
       * @ngdoc service
       * @name $animate
       * @function
       *
       * @description
       * The `$animate` service provides animation detection support while performing DOM operations (enter, leave and move) as well as during addClass and removeClass operations.
       * When any of these operations are run, the $animate service
       * will examine any JavaScript-defined animations (which are defined by using the $animateProvider provider object)
       * as well as any CSS-defined animations against the CSS classes present on the element once the DOM operation is run.
       *
       * The `$animate` service is used behind the scenes with pre-existing directives and animation with these directives
       * will work out of the box without any extra configuration.
       *
       * Requires the {@link ngAnimate `ngAnimate`} module to be installed.
       *
       * Please visit the {@link ngAnimate `ngAnimate`} module overview page learn more about how to use animations in your application.
       *
       */
      return {
        /**
         * @ngdoc method
         * @name $animate#enter
         * @function
         *
         * @description
         * Appends the element to the parentElement element that resides in the document and then runs the enter animation. Once
         * the animation is started, the following CSS classes will be present on the element for the duration of the animation:
         *
         * Below is a breakdown of each step that occurs during enter animation:
         *
         * | Animation Step                                                                               | What the element class attribute looks like |
         * |----------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.enter(...) is called                                                             | class="my-animation"                        |
         * | 2. element is inserted into the parentElement element or beside the afterElement element     | class="my-animation"                        |
         * | 3. $animate runs any JavaScript-defined animations on the element                            | class="my-animation ng-animate"             |
         * | 4. the .ng-enter class is added to the element                                               | class="my-animation ng-animate ng-enter"    |
         * | 5. $animate scans the element styles to get the CSS transition/animation duration and delay  | class="my-animation ng-animate ng-enter"    |
         * | 6. $animate waits for 10ms (this performs a reflow)                                          | class="my-animation ng-animate ng-enter"    |
         * | 7. the .ng-enter-active and .ng-animate-active classes are added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active ng-enter ng-enter-active" |
         * | 8. $animate waits for X milliseconds for the animation to complete                           | class="my-animation ng-animate ng-animate-active ng-enter ng-enter-active" |
         * | 9. The animation ends and all generated CSS classes are removed from the element             | class="my-animation"                        |
         * | 10. The doneCallback() callback is fired (if provided)                                       | class="my-animation"                        |
         *
         * @param {DOMElement} element the element that will be the focus of the enter animation
         * @param {DOMElement} parentElement the parent element of the element that will be the focus of the enter animation
         * @param {DOMElement} afterElement the sibling element (which is the previous element) of the element that will be the focus of the enter animation
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        enter : function(element, parentElement, afterElement, doneCallback) {
          this.enabled(false, element);
          $delegate.enter(element, parentElement, afterElement);
          $rootScope.$$postDigest(function() {
            element = stripCommentsFromElement(element);
            performAnimation('enter', 'ng-enter', element, parentElement, afterElement, noop, doneCallback);
          });
        },

        /**
         * @ngdoc method
         * @name $animate#leave
         * @function
         *
         * @description
         * Runs the leave animation operation and, upon completion, removes the element from the DOM. Once
         * the animation is started, the following CSS classes will be added for the duration of the animation:
         *
         * Below is a breakdown of each step that occurs during leave animation:
         *
         * | Animation Step                                                                               | What the element class attribute looks like |
         * |----------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.leave(...) is called                                                             | class="my-animation"                        |
         * | 2. $animate runs any JavaScript-defined animations on the element                            | class="my-animation ng-animate"             |
         * | 3. the .ng-leave class is added to the element                                               | class="my-animation ng-animate ng-leave"    |
         * | 4. $animate scans the element styles to get the CSS transition/animation duration and delay  | class="my-animation ng-animate ng-leave"    |
         * | 5. $animate waits for 10ms (this performs a reflow)                                          | class="my-animation ng-animate ng-leave"    |
         * | 6. the .ng-leave-active and .ng-animate-active classes is added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active ng-leave ng-leave-active" |
         * | 7. $animate waits for X milliseconds for the animation to complete                           | class="my-animation ng-animate ng-animate-active ng-leave ng-leave-active" |
         * | 8. The animation ends and all generated CSS classes are removed from the element             | class="my-animation"                        |
         * | 9. The element is removed from the DOM                                                       | ...                                         |
         * | 10. The doneCallback() callback is fired (if provided)                                       | ...                                         |
         *
         * @param {DOMElement} element the element that will be the focus of the leave animation
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        leave : function(element, doneCallback) {
          cancelChildAnimations(element);
          this.enabled(false, element);
          $rootScope.$$postDigest(function() {
            performAnimation('leave', 'ng-leave', stripCommentsFromElement(element), null, null, function() {
              $delegate.leave(element);
            }, doneCallback);
          });
        },

        /**
         * @ngdoc method
         * @name $animate#move
         * @function
         *
         * @description
         * Fires the move DOM operation. Just before the animation starts, the animate service will either append it into the parentElement container or
         * add the element directly after the afterElement element if present. Then the move animation will be run. Once
         * the animation is started, the following CSS classes will be added for the duration of the animation:
         *
         * Below is a breakdown of each step that occurs during move animation:
         *
         * | Animation Step                                                                               | What the element class attribute looks like |
         * |----------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.move(...) is called                                                              | class="my-animation"                        |
         * | 2. element is moved into the parentElement element or beside the afterElement element        | class="my-animation"                        |
         * | 3. $animate runs any JavaScript-defined animations on the element                            | class="my-animation ng-animate"             |
         * | 4. the .ng-move class is added to the element                                                | class="my-animation ng-animate ng-move"     |
         * | 5. $animate scans the element styles to get the CSS transition/animation duration and delay  | class="my-animation ng-animate ng-move"     |
         * | 6. $animate waits for 10ms (this performs a reflow)                                          | class="my-animation ng-animate ng-move"     |
         * | 7. the .ng-move-active and .ng-animate-active classes is added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active ng-move ng-move-active" |
         * | 8. $animate waits for X milliseconds for the animation to complete                           | class="my-animation ng-animate ng-animate-active ng-move ng-move-active" |
         * | 9. The animation ends and all generated CSS classes are removed from the element             | class="my-animation"                        |
         * | 10. The doneCallback() callback is fired (if provided)                                       | class="my-animation"                        |
         *
         * @param {DOMElement} element the element that will be the focus of the move animation
         * @param {DOMElement} parentElement the parentElement element of the element that will be the focus of the move animation
         * @param {DOMElement} afterElement the sibling element (which is the previous element) of the element that will be the focus of the move animation
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        move : function(element, parentElement, afterElement, doneCallback) {
          cancelChildAnimations(element);
          this.enabled(false, element);
          $delegate.move(element, parentElement, afterElement);
          $rootScope.$$postDigest(function() {
            element = stripCommentsFromElement(element);
            performAnimation('move', 'ng-move', element, parentElement, afterElement, noop, doneCallback);
          });
        },

        /**
         * @ngdoc method
         * @name $animate#addClass
         *
         * @description
         * Triggers a custom animation event based off the className variable and then attaches the className value to the element as a CSS class.
         * Unlike the other animation methods, the animate service will suffix the className value with {@type -add} in order to provide
         * the animate service the setup and active CSS classes in order to trigger the animation (this will be skipped if no CSS transitions
         * or keyframes are defined on the -add or base CSS class).
         *
         * Below is a breakdown of each step that occurs during addClass animation:
         *
         * | Animation Step                                                                                 | What the element class attribute looks like |
         * |------------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.addClass(element, 'super') is called                                               | class="my-animation"                        |
         * | 2. $animate runs any JavaScript-defined animations on the element                              | class="my-animation ng-animate"             |
         * | 3. the .super-add class are added to the element                                               | class="my-animation ng-animate super-add"   |
         * | 4. $animate scans the element styles to get the CSS transition/animation duration and delay    | class="my-animation ng-animate super-add"   |
         * | 5. $animate waits for 10ms (this performs a reflow)                                            | class="my-animation ng-animate super-add"   |
         * | 6. the .super, .super-add-active and .ng-animate-active classes are added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active super super-add super-add-active"          |
         * | 7. $animate waits for X milliseconds for the animation to complete                             | class="my-animation super super-add super-add-active"  |
         * | 8. The animation ends and all generated CSS classes are removed from the element               | class="my-animation super"                  |
         * | 9. The super class is kept on the element                                                      | class="my-animation super"                  |
         * | 10. The doneCallback() callback is fired (if provided)                                         | class="my-animation super"                  |
         *
         * @param {DOMElement} element the element that will be animated
         * @param {string} className the CSS class that will be added to the element and then animated
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        addClass : function(element, className, doneCallback) {
          element = stripCommentsFromElement(element);
          performAnimation('addClass', className, element, null, null, function() {
            $delegate.addClass(element, className);
          }, doneCallback);
        },

        /**
         * @ngdoc method
         * @name $animate#removeClass
         *
         * @description
         * Triggers a custom animation event based off the className variable and then removes the CSS class provided by the className value
         * from the element. Unlike the other animation methods, the animate service will suffix the className value with {@type -remove} in
         * order to provide the animate service the setup and active CSS classes in order to trigger the animation (this will be skipped if
         * no CSS transitions or keyframes are defined on the -remove or base CSS classes).
         *
         * Below is a breakdown of each step that occurs during removeClass animation:
         *
         * | Animation Step                                                                                | What the element class attribute looks like     |
         * |-----------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.removeClass(element, 'super') is called                                           | class="my-animation super"                  |
         * | 2. $animate runs any JavaScript-defined animations on the element                             | class="my-animation super ng-animate"       |
         * | 3. the .super-remove class are added to the element                                           | class="my-animation super ng-animate super-remove"|
         * | 4. $animate scans the element styles to get the CSS transition/animation duration and delay   | class="my-animation super ng-animate super-remove"   |
         * | 5. $animate waits for 10ms (this performs a reflow)                                           | class="my-animation super ng-animate super-remove"   |
         * | 6. the .super-remove-active and .ng-animate-active classes are added and .super is removed (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active super-remove super-remove-active"          |
         * | 7. $animate waits for X milliseconds for the animation to complete                            | class="my-animation ng-animate ng-animate-active super-remove super-remove-active"   |
         * | 8. The animation ends and all generated CSS classes are removed from the element              | class="my-animation"                        |
         * | 9. The doneCallback() callback is fired (if provided)                                         | class="my-animation"                        |
         *
         *
         * @param {DOMElement} element the element that will be animated
         * @param {string} className the CSS class that will be animated and then removed from the element
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        removeClass : function(element, className, doneCallback) {
          element = stripCommentsFromElement(element);
          performAnimation('removeClass', className, element, null, null, function() {
            $delegate.removeClass(element, className);
          }, doneCallback);
        },

          /**
           *
           * @ngdoc function
           * @name $animate#setClass
           * @function
           * @description Adds and/or removes the given CSS classes to and from the element.
           * Once complete, the done() callback will be fired (if provided).
           * @param {DOMElement} element the element which will it's CSS classes changed
           *   removed from it
           * @param {string} add the CSS classes which will be added to the element
           * @param {string} remove the CSS class which will be removed from the element
           * @param {Function=} done the callback function (if provided) that will be fired after the
           *   CSS classes have been set on the element
           */
        setClass : function(element, add, remove, doneCallback) {
          element = stripCommentsFromElement(element);
          performAnimation('setClass', [add, remove], element, null, null, function() {
            $delegate.setClass(element, add, remove);
          }, doneCallback);
        },

        /**
         * @ngdoc method
         * @name $animate#enabled
         * @function
         *
         * @param {boolean=} value If provided then set the animation on or off.
         * @param {DOMElement=} element If provided then the element will be used to represent the enable/disable operation
         * @return {boolean} Current animation state.
         *
         * @description
         * Globally enables/disables animations.
         *
        */
        enabled : function(value, element) {
          switch(arguments.length) {
            case 2:
              if(value) {
                cleanup(element);
              } else {
                var data = element.data(NG_ANIMATE_STATE) || {};
                data.disabled = true;
                element.data(NG_ANIMATE_STATE, data);
              }
            break;

            case 1:
              rootAnimateState.disabled = !value;
            break;

            default:
              value = !rootAnimateState.disabled;
            break;
          }
          return !!value;
         }
      };

      /*
        all animations call this shared animation triggering function internally.
        The animationEvent variable refers to the JavaScript animation event that will be triggered
        and the className value is the name of the animation that will be applied within the
        CSS code. Element, parentElement and afterElement are provided DOM elements for the animation
        and the onComplete callback will be fired once the animation is fully complete.
      */
      function performAnimation(animationEvent, className, element, parentElement, afterElement, domOperation, doneCallback) {

        var runner = animationRunner(element, animationEvent, className);
        if(!runner) {
          fireDOMOperation();
          fireBeforeCallbackAsync();
          fireAfterCallbackAsync();
          closeAnimation();
          return;
        }

        className = runner.className;
        var elementEvents = angular.element._data(runner.node);
        elementEvents = elementEvents && elementEvents.events;

        if (!parentElement) {
          parentElement = afterElement ? afterElement.parent() : element.parent();
        }

        var ngAnimateState  = element.data(NG_ANIMATE_STATE) || {};
        var runningAnimations     = ngAnimateState.active || {};
        var totalActiveAnimations = ngAnimateState.totalActive || 0;
        var lastAnimation         = ngAnimateState.last;

        //only allow animations if the currently running animation is not structural
        //or if there is no animation running at all
        var skipAnimations = runner.isClassBased ?
          ngAnimateState.disabled || (lastAnimation && !lastAnimation.isClassBased) :
          false;

        //skip the animation if animations are disabled, a parent is already being animated,
        //the element is not currently attached to the document body or then completely close
        //the animation if any matching animations are not found at all.
        //NOTE: IE8 + IE9 should close properly (run closeAnimation()) in case an animation was found.
        if (skipAnimations || animationsDisabled(element, parentElement)) {
          fireDOMOperation();
          fireBeforeCallbackAsync();
          fireAfterCallbackAsync();
          closeAnimation();
          return;
        }

        var skipAnimation = false;
        if(totalActiveAnimations > 0) {
          var animationsToCancel = [];
          if(!runner.isClassBased) {
            if(animationEvent == 'leave' && runningAnimations['ng-leave']) {
              skipAnimation = true;
            } else {
              //cancel all animations when a structural animation takes place
              for(var klass in runningAnimations) {
                animationsToCancel.push(runningAnimations[klass]);
                cleanup(element, klass);
              }
              runningAnimations = {};
              totalActiveAnimations = 0;
            }
          } else if(lastAnimation.event == 'setClass') {
            animationsToCancel.push(lastAnimation);
            cleanup(element, className);
          }
          else if(runningAnimations[className]) {
            var current = runningAnimations[className];
            if(current.event == animationEvent) {
              skipAnimation = true;
            } else {
              animationsToCancel.push(current);
              cleanup(element, className);
            }
          }

          if(animationsToCancel.length > 0) {
            forEach(animationsToCancel, function(operation) {
              operation.cancel();
            });
          }
        }

        if(runner.isClassBased && !runner.isSetClassOperation && !skipAnimation) {
          skipAnimation = (animationEvent == 'addClass') == element.hasClass(className); //opposite of XOR
        }

        if(skipAnimation) {
          fireBeforeCallbackAsync();
          fireAfterCallbackAsync();
          fireDoneCallbackAsync();
          return;
        }

        if(animationEvent == 'leave') {
          //there's no need to ever remove the listener since the element
          //will be removed (destroyed) after the leave animation ends or
          //is cancelled midway
          element.one('$destroy', function(e) {
            var element = angular.element(this);
            var state = element.data(NG_ANIMATE_STATE);
            if(state) {
              var activeLeaveAnimation = state.active['ng-leave'];
              if(activeLeaveAnimation) {
                activeLeaveAnimation.cancel();
                cleanup(element, 'ng-leave');
              }
            }
          });
        }

        //the ng-animate class does nothing, but it's here to allow for
        //parent animations to find and cancel child animations when needed
        element.addClass(NG_ANIMATE_CLASS_NAME);

        var localAnimationCount = globalAnimationCounter++;
        totalActiveAnimations++;
        runningAnimations[className] = runner;

        element.data(NG_ANIMATE_STATE, {
          last : runner,
          active : runningAnimations,
          index : localAnimationCount,
          totalActive : totalActiveAnimations
        });

        //first we run the before animations and when all of those are complete
        //then we perform the DOM operation and run the next set of animations
        fireBeforeCallbackAsync();
        runner.before(function(cancelled) {
          var data = element.data(NG_ANIMATE_STATE);
          cancelled = cancelled ||
                        !data || !data.active[className] ||
                        (runner.isClassBased && data.active[className].event != animationEvent);

          fireDOMOperation();
          if(cancelled === true) {
            closeAnimation();
          } else {
            fireAfterCallbackAsync();
            runner.after(closeAnimation);
          }
        });

        function fireDOMCallback(animationPhase) {
          var eventName = '$animate:' + animationPhase;
          if(elementEvents && elementEvents[eventName] && elementEvents[eventName].length > 0) {
            $$asyncCallback(function() {
              element.triggerHandler(eventName, {
                event : animationEvent,
                className : className
              });
            });
          }
        }

        function fireBeforeCallbackAsync() {
          fireDOMCallback('before');
        }

        function fireAfterCallbackAsync() {
          fireDOMCallback('after');
        }

        function fireDoneCallbackAsync() {
          fireDOMCallback('close');
          if(doneCallback) {
            $$asyncCallback(function() {
              doneCallback();
            });
          }
        }

        //it is less complicated to use a flag than managing and canceling
        //timeouts containing multiple callbacks.
        function fireDOMOperation() {
          if(!fireDOMOperation.hasBeenRun) {
            fireDOMOperation.hasBeenRun = true;
            domOperation();
          }
        }

        function closeAnimation() {
          if(!closeAnimation.hasBeenRun) {
            closeAnimation.hasBeenRun = true;
            var data = element.data(NG_ANIMATE_STATE);
            if(data) {
              /* only structural animations wait for reflow before removing an
                 animation, but class-based animations don't. An example of this
                 failing would be when a parent HTML tag has a ng-class attribute
                 causing ALL directives below to skip animations during the digest */
              if(runner && runner.isClassBased) {
                cleanup(element, className);
              } else {
                $$asyncCallback(function() {
                  var data = element.data(NG_ANIMATE_STATE) || {};
                  if(localAnimationCount == data.index) {
                    cleanup(element, className, animationEvent);
                  }
                });
                element.data(NG_ANIMATE_STATE, data);
              }
            }
            fireDoneCallbackAsync();
          }
        }
      }

      function cancelChildAnimations(element) {
        var node = extractElementNode(element);
        if (node) {
          var nodes = angular.isFunction(node.getElementsByClassName) ?
            node.getElementsByClassName(NG_ANIMATE_CLASS_NAME) :
            node.querySelectorAll('.' + NG_ANIMATE_CLASS_NAME);
          forEach(nodes, function(element) {
            element = angular.element(element);
            var data = element.data(NG_ANIMATE_STATE);
            if(data && data.active) {
              forEach(data.active, function(runner) {
                runner.cancel();
              });
            }
          });
        }
      }

      function cleanup(element, className) {
        if(isMatchingElement(element, $rootElement)) {
          if(!rootAnimateState.disabled) {
            rootAnimateState.running = false;
            rootAnimateState.structural = false;
          }
        } else if(className) {
          var data = element.data(NG_ANIMATE_STATE) || {};

          var removeAnimations = className === true;
          if(!removeAnimations && data.active && data.active[className]) {
            data.totalActive--;
            delete data.active[className];
          }

          if(removeAnimations || !data.totalActive) {
            element.removeClass(NG_ANIMATE_CLASS_NAME);
            element.removeData(NG_ANIMATE_STATE);
          }
        }
      }

      function animationsDisabled(element, parentElement) {
        if (rootAnimateState.disabled) return true;

        if(isMatchingElement(element, $rootElement)) {
          return rootAnimateState.disabled || rootAnimateState.running;
        }

        do {
          //the element did not reach the root element which means that it
          //is not apart of the DOM. Therefore there is no reason to do
          //any animations on it
          if(parentElement.length === 0) break;

          var isRoot = isMatchingElement(parentElement, $rootElement);
          var state = isRoot ? rootAnimateState : parentElement.data(NG_ANIMATE_STATE);
          var result = state && (!!state.disabled || state.running || state.totalActive > 0);
          if(isRoot || result) {
            return result;
          }

          if(isRoot) return true;
        }
        while(parentElement = parentElement.parent());

        return true;
      }
    }]);

    $animateProvider.register('', ['$window', '$sniffer', '$timeout', '$$animateReflow',
                           function($window,   $sniffer,   $timeout,   $$animateReflow) {
      // Detect proper transitionend/animationend event names.
      var CSS_PREFIX = '', TRANSITION_PROP, TRANSITIONEND_EVENT, ANIMATION_PROP, ANIMATIONEND_EVENT;

      // If unprefixed events are not supported but webkit-prefixed are, use the latter.
      // Otherwise, just use W3C names, browsers not supporting them at all will just ignore them.
      // Note: Chrome implements `window.onwebkitanimationend` and doesn't implement `window.onanimationend`
      // but at the same time dispatches the `animationend` event and not `webkitAnimationEnd`.
      // Register both events in case `window.onanimationend` is not supported because of that,
      // do the same for `transitionend` as Safari is likely to exhibit similar behavior.
      // Also, the only modern browser that uses vendor prefixes for transitions/keyframes is webkit
      // therefore there is no reason to test anymore for other vendor prefixes: http://caniuse.com/#search=transition
      if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined) {
        CSS_PREFIX = '-webkit-';
        TRANSITION_PROP = 'WebkitTransition';
        TRANSITIONEND_EVENT = 'webkitTransitionEnd transitionend';
      } else {
        TRANSITION_PROP = 'transition';
        TRANSITIONEND_EVENT = 'transitionend';
      }

      if (window.onanimationend === undefined && window.onwebkitanimationend !== undefined) {
        CSS_PREFIX = '-webkit-';
        ANIMATION_PROP = 'WebkitAnimation';
        ANIMATIONEND_EVENT = 'webkitAnimationEnd animationend';
      } else {
        ANIMATION_PROP = 'animation';
        ANIMATIONEND_EVENT = 'animationend';
      }

      var DURATION_KEY = 'Duration';
      var PROPERTY_KEY = 'Property';
      var DELAY_KEY = 'Delay';
      var ANIMATION_ITERATION_COUNT_KEY = 'IterationCount';
      var NG_ANIMATE_PARENT_KEY = '$$ngAnimateKey';
      var NG_ANIMATE_CSS_DATA_KEY = '$$ngAnimateCSS3Data';
      var NG_ANIMATE_BLOCK_CLASS_NAME = 'ng-animate-block-transitions';
      var ELAPSED_TIME_MAX_DECIMAL_PLACES = 3;
      var CLOSING_TIME_BUFFER = 1.5;
      var ONE_SECOND = 1000;

      var lookupCache = {};
      var parentCounter = 0;
      var animationReflowQueue = [];
      var cancelAnimationReflow;
      function afterReflow(element, callback) {
        if(cancelAnimationReflow) {
          cancelAnimationReflow();
        }
        animationReflowQueue.push(callback);
        cancelAnimationReflow = $$animateReflow(function() {
          forEach(animationReflowQueue, function(fn) {
            fn();
          });

          animationReflowQueue = [];
          cancelAnimationReflow = null;
          lookupCache = {};
        });
      }

      var closingTimer = null;
      var closingTimestamp = 0;
      var animationElementQueue = [];
      function animationCloseHandler(element, totalTime) {
        var node = extractElementNode(element);
        element = angular.element(node);

        //this item will be garbage collected by the closing
        //animation timeout
        animationElementQueue.push(element);

        //but it may not need to cancel out the existing timeout
        //if the timestamp is less than the previous one
        var futureTimestamp = Date.now() + (totalTime * 1000);
        if(futureTimestamp <= closingTimestamp) {
          return;
        }

        $timeout.cancel(closingTimer);

        closingTimestamp = futureTimestamp;
        closingTimer = $timeout(function() {
          closeAllAnimations(animationElementQueue);
          animationElementQueue = [];
        }, totalTime, false);
      }

      function closeAllAnimations(elements) {
        forEach(elements, function(element) {
          var elementData = element.data(NG_ANIMATE_CSS_DATA_KEY);
          if(elementData) {
            (elementData.closeAnimationFn || noop)();
          }
        });
      }

      function getElementAnimationDetails(element, cacheKey) {
        var data = cacheKey ? lookupCache[cacheKey] : null;
        if(!data) {
          var transitionDuration = 0;
          var transitionDelay = 0;
          var animationDuration = 0;
          var animationDelay = 0;
          var transitionDelayStyle;
          var animationDelayStyle;
          var transitionDurationStyle;
          var transitionPropertyStyle;

          //we want all the styles defined before and after
          forEach(element, function(element) {
            if (element.nodeType == ELEMENT_NODE) {
              var elementStyles = $window.getComputedStyle(element) || {};

              transitionDurationStyle = elementStyles[TRANSITION_PROP + DURATION_KEY];

              transitionDuration = Math.max(parseMaxTime(transitionDurationStyle), transitionDuration);

              transitionPropertyStyle = elementStyles[TRANSITION_PROP + PROPERTY_KEY];

              transitionDelayStyle = elementStyles[TRANSITION_PROP + DELAY_KEY];

              transitionDelay  = Math.max(parseMaxTime(transitionDelayStyle), transitionDelay);

              animationDelayStyle = elementStyles[ANIMATION_PROP + DELAY_KEY];

              animationDelay   = Math.max(parseMaxTime(animationDelayStyle), animationDelay);

              var aDuration  = parseMaxTime(elementStyles[ANIMATION_PROP + DURATION_KEY]);

              if(aDuration > 0) {
                aDuration *= parseInt(elementStyles[ANIMATION_PROP + ANIMATION_ITERATION_COUNT_KEY], 10) || 1;
              }

              animationDuration = Math.max(aDuration, animationDuration);
            }
          });
          data = {
            total : 0,
            transitionPropertyStyle: transitionPropertyStyle,
            transitionDurationStyle: transitionDurationStyle,
            transitionDelayStyle: transitionDelayStyle,
            transitionDelay: transitionDelay,
            transitionDuration: transitionDuration,
            animationDelayStyle: animationDelayStyle,
            animationDelay: animationDelay,
            animationDuration: animationDuration
          };
          if(cacheKey) {
            lookupCache[cacheKey] = data;
          }
        }
        return data;
      }

      function parseMaxTime(str) {
        var maxValue = 0;
        var values = angular.isString(str) ?
          str.split(/\s*,\s*/) :
          [];
        forEach(values, function(value) {
          maxValue = Math.max(parseFloat(value) || 0, maxValue);
        });
        return maxValue;
      }

      function getCacheKey(element) {
        var parentElement = element.parent();
        var parentID = parentElement.data(NG_ANIMATE_PARENT_KEY);
        if(!parentID) {
          parentElement.data(NG_ANIMATE_PARENT_KEY, ++parentCounter);
          parentID = parentCounter;
        }
        return parentID + '-' + extractElementNode(element).className;
      }

      function animateSetup(animationEvent, element, className, calculationDecorator) {
        var cacheKey = getCacheKey(element);
        var eventCacheKey = cacheKey + ' ' + className;
        var itemIndex = lookupCache[eventCacheKey] ? ++lookupCache[eventCacheKey].total : 0;

        var stagger = {};
        if(itemIndex > 0) {
          var staggerClassName = className + '-stagger';
          var staggerCacheKey = cacheKey + ' ' + staggerClassName;
          var applyClasses = !lookupCache[staggerCacheKey];

          applyClasses && element.addClass(staggerClassName);

          stagger = getElementAnimationDetails(element, staggerCacheKey);

          applyClasses && element.removeClass(staggerClassName);
        }

        /* the animation itself may need to add/remove special CSS classes
         * before calculating the anmation styles */
        calculationDecorator = calculationDecorator ||
                               function(fn) { return fn(); };

        element.addClass(className);

        var formerData = element.data(NG_ANIMATE_CSS_DATA_KEY) || {};

        var timings = calculationDecorator(function() {
          return getElementAnimationDetails(element, eventCacheKey);
        });

        var transitionDuration = timings.transitionDuration;
        var animationDuration = timings.animationDuration;
        if(transitionDuration === 0 && animationDuration === 0) {
          element.removeClass(className);
          return false;
        }

        element.data(NG_ANIMATE_CSS_DATA_KEY, {
          running : formerData.running || 0,
          itemIndex : itemIndex,
          stagger : stagger,
          timings : timings,
          closeAnimationFn : noop
        });

        //temporarily disable the transition so that the enter styles
        //don't animate twice (this is here to avoid a bug in Chrome/FF).
        var isCurrentlyAnimating = formerData.running > 0 || animationEvent == 'setClass';
        if(transitionDuration > 0) {
          blockTransitions(element, className, isCurrentlyAnimating);
        }

        //staggering keyframe animations work by adjusting the `animation-delay` CSS property
        //on the given element, however, the delay value can only calculated after the reflow
        //since by that time $animate knows how many elements are being animated. Therefore,
        //until the reflow occurs the element needs to be blocked (where the keyframe animation
        //is set to `none 0s`). This blocking mechanism should only be set for when a stagger
        //animation is detected and when the element item index is greater than 0.
        if(animationDuration > 0 && stagger.animationDelay > 0 && stagger.animationDuration === 0) {
          blockKeyframeAnimations(element);
        }

        return true;
      }

      function isStructuralAnimation(className) {
        return className == 'ng-enter' || className == 'ng-move' || className == 'ng-leave';
      }

      function blockTransitions(element, className, isAnimating) {
        if(isStructuralAnimation(className) || !isAnimating) {
          extractElementNode(element).style[TRANSITION_PROP + PROPERTY_KEY] = 'none';
        } else {
          element.addClass(NG_ANIMATE_BLOCK_CLASS_NAME);
        }
      }

      function blockKeyframeAnimations(element) {
        extractElementNode(element).style[ANIMATION_PROP] = 'none 0s';
      }

      function unblockTransitions(element, className) {
        var prop = TRANSITION_PROP + PROPERTY_KEY;
        var node = extractElementNode(element);
        if(node.style[prop] && node.style[prop].length > 0) {
          node.style[prop] = '';
        }
        element.removeClass(NG_ANIMATE_BLOCK_CLASS_NAME);
      }

      function unblockKeyframeAnimations(element) {
        var prop = ANIMATION_PROP;
        var node = extractElementNode(element);
        if(node.style[prop] && node.style[prop].length > 0) {
          node.style[prop] = '';
        }
      }

      function animateRun(animationEvent, element, className, activeAnimationComplete) {
        var node = extractElementNode(element);
        var elementData = element.data(NG_ANIMATE_CSS_DATA_KEY);
        if(node.className.indexOf(className) == -1 || !elementData) {
          activeAnimationComplete();
          return;
        }

        var activeClassName = '';
        forEach(className.split(' '), function(klass, i) {
          activeClassName += (i > 0 ? ' ' : '') + klass + '-active';
        });

        var stagger = elementData.stagger;
        var timings = elementData.timings;
        var itemIndex = elementData.itemIndex;
        var maxDuration = Math.max(timings.transitionDuration, timings.animationDuration);
        var maxDelay = Math.max(timings.transitionDelay, timings.animationDelay);
        var maxDelayTime = maxDelay * ONE_SECOND;

        var startTime = Date.now();
        var css3AnimationEvents = ANIMATIONEND_EVENT + ' ' + TRANSITIONEND_EVENT;

        var style = '', appliedStyles = [];
        if(timings.transitionDuration > 0) {
          var propertyStyle = timings.transitionPropertyStyle;
          if(propertyStyle.indexOf('all') == -1) {
            style += CSS_PREFIX + 'transition-property: ' + propertyStyle + ';';
            style += CSS_PREFIX + 'transition-duration: ' + timings.transitionDurationStyle + ';';
            appliedStyles.push(CSS_PREFIX + 'transition-property');
            appliedStyles.push(CSS_PREFIX + 'transition-duration');
          }
        }

        if(itemIndex > 0) {
          if(stagger.transitionDelay > 0 && stagger.transitionDuration === 0) {
            var delayStyle = timings.transitionDelayStyle;
            style += CSS_PREFIX + 'transition-delay: ' +
                     prepareStaggerDelay(delayStyle, stagger.transitionDelay, itemIndex) + '; ';
            appliedStyles.push(CSS_PREFIX + 'transition-delay');
          }

          if(stagger.animationDelay > 0 && stagger.animationDuration === 0) {
            style += CSS_PREFIX + 'animation-delay: ' +
                     prepareStaggerDelay(timings.animationDelayStyle, stagger.animationDelay, itemIndex) + '; ';
            appliedStyles.push(CSS_PREFIX + 'animation-delay');
          }
        }

        if(appliedStyles.length > 0) {
          //the element being animated may sometimes contain comment nodes in
          //the jqLite object, so we're safe to use a single variable to house
          //the styles since there is always only one element being animated
          var oldStyle = node.getAttribute('style') || '';
          node.setAttribute('style', oldStyle + ' ' + style);
        }

        element.on(css3AnimationEvents, onAnimationProgress);
        element.addClass(activeClassName);
        elementData.closeAnimationFn = function() {
          onEnd();
          activeAnimationComplete();
        };

        var staggerTime       = itemIndex * (Math.max(stagger.animationDelay, stagger.transitionDelay) || 0);
        var animationTime     = (maxDelay + maxDuration) * CLOSING_TIME_BUFFER;
        var totalTime         = (staggerTime + animationTime) * ONE_SECOND;

        elementData.running++;
        animationCloseHandler(element, totalTime);
        return onEnd;

        // This will automatically be called by $animate so
        // there is no need to attach this internally to the
        // timeout done method.
        function onEnd(cancelled) {
          element.off(css3AnimationEvents, onAnimationProgress);
          element.removeClass(activeClassName);
          animateClose(element, className);
          var node = extractElementNode(element);
          for (var i in appliedStyles) {
            node.style.removeProperty(appliedStyles[i]);
          }
        }

        function onAnimationProgress(event) {
          event.stopPropagation();
          var ev = event.originalEvent || event;
          var timeStamp = ev.$manualTimeStamp || ev.timeStamp || Date.now();

          /* Firefox (or possibly just Gecko) likes to not round values up
           * when a ms measurement is used for the animation */
          var elapsedTime = parseFloat(ev.elapsedTime.toFixed(ELAPSED_TIME_MAX_DECIMAL_PLACES));

          /* $manualTimeStamp is a mocked timeStamp value which is set
           * within browserTrigger(). This is only here so that tests can
           * mock animations properly. Real events fallback to event.timeStamp,
           * or, if they don't, then a timeStamp is automatically created for them.
           * We're checking to see if the timeStamp surpasses the expected delay,
           * but we're using elapsedTime instead of the timeStamp on the 2nd
           * pre-condition since animations sometimes close off early */
          if(Math.max(timeStamp - startTime, 0) >= maxDelayTime && elapsedTime >= maxDuration) {
            activeAnimationComplete();
          }
        }
      }

      function prepareStaggerDelay(delayStyle, staggerDelay, index) {
        var style = '';
        forEach(delayStyle.split(','), function(val, i) {
          style += (i > 0 ? ',' : '') +
                   (index * staggerDelay + parseInt(val, 10)) + 's';
        });
        return style;
      }

      function animateBefore(animationEvent, element, className, calculationDecorator) {
        if(animateSetup(animationEvent, element, className, calculationDecorator)) {
          return function(cancelled) {
            cancelled && animateClose(element, className);
          };
        }
      }

      function animateAfter(animationEvent, element, className, afterAnimationComplete) {
        if(element.data(NG_ANIMATE_CSS_DATA_KEY)) {
          return animateRun(animationEvent, element, className, afterAnimationComplete);
        } else {
          animateClose(element, className);
          afterAnimationComplete();
        }
      }

      function animate(animationEvent, element, className, animationComplete) {
        //If the animateSetup function doesn't bother returning a
        //cancellation function then it means that there is no animation
        //to perform at all
        var preReflowCancellation = animateBefore(animationEvent, element, className);
        if(!preReflowCancellation) {
          animationComplete();
          return;
        }

        //There are two cancellation functions: one is before the first
        //reflow animation and the second is during the active state
        //animation. The first function will take care of removing the
        //data from the element which will not make the 2nd animation
        //happen in the first place
        var cancel = preReflowCancellation;
        afterReflow(element, function() {
          unblockTransitions(element, className);
          unblockKeyframeAnimations(element);
          //once the reflow is complete then we point cancel to
          //the new cancellation function which will remove all of the
          //animation properties from the active animation
          cancel = animateAfter(animationEvent, element, className, animationComplete);
        });

        return function(cancelled) {
          (cancel || noop)(cancelled);
        };
      }

      function animateClose(element, className) {
        element.removeClass(className);
        var data = element.data(NG_ANIMATE_CSS_DATA_KEY);
        if(data) {
          if(data.running) {
            data.running--;
          }
          if(!data.running || data.running === 0) {
            element.removeData(NG_ANIMATE_CSS_DATA_KEY);
          }
        }
      }

      return {
        enter : function(element, animationCompleted) {
          return animate('enter', element, 'ng-enter', animationCompleted);
        },

        leave : function(element, animationCompleted) {
          return animate('leave', element, 'ng-leave', animationCompleted);
        },

        move : function(element, animationCompleted) {
          return animate('move', element, 'ng-move', animationCompleted);
        },

        beforeSetClass : function(element, add, remove, animationCompleted) {
          var className = suffixClasses(remove, '-remove') + ' ' +
                          suffixClasses(add, '-add');
          var cancellationMethod = animateBefore('setClass', element, className, function(fn) {
            /* when classes are removed from an element then the transition style
             * that is applied is the transition defined on the element without the
             * CSS class being there. This is how CSS3 functions outside of ngAnimate.
             * http://plnkr.co/edit/j8OzgTNxHTb4n3zLyjGW?p=preview */
            var klass = element.attr('class');
            element.removeClass(remove);
            element.addClass(add);
            var timings = fn();
            element.attr('class', klass);
            return timings;
          });

          if(cancellationMethod) {
            afterReflow(element, function() {
              unblockTransitions(element, className);
              unblockKeyframeAnimations(element);
              animationCompleted();
            });
            return cancellationMethod;
          }
          animationCompleted();
        },

        beforeAddClass : function(element, className, animationCompleted) {
          var cancellationMethod = animateBefore('addClass', element, suffixClasses(className, '-add'), function(fn) {

            /* when a CSS class is added to an element then the transition style that
             * is applied is the transition defined on the element when the CSS class
             * is added at the time of the animation. This is how CSS3 functions
             * outside of ngAnimate. */
            element.addClass(className);
            var timings = fn();
            element.removeClass(className);
            return timings;
          });

          if(cancellationMethod) {
            afterReflow(element, function() {
              unblockTransitions(element, className);
              unblockKeyframeAnimations(element);
              animationCompleted();
            });
            return cancellationMethod;
          }
          animationCompleted();
        },

        setClass : function(element, add, remove, animationCompleted) {
          remove = suffixClasses(remove, '-remove');
          add = suffixClasses(add, '-add');
          var className = remove + ' ' + add;
          return animateAfter('setClass', element, className, animationCompleted);
        },

        addClass : function(element, className, animationCompleted) {
          return animateAfter('addClass', element, suffixClasses(className, '-add'), animationCompleted);
        },

        beforeRemoveClass : function(element, className, animationCompleted) {
          var cancellationMethod = animateBefore('removeClass', element, suffixClasses(className, '-remove'), function(fn) {
            /* when classes are removed from an element then the transition style
             * that is applied is the transition defined on the element without the
             * CSS class being there. This is how CSS3 functions outside of ngAnimate.
             * http://plnkr.co/edit/j8OzgTNxHTb4n3zLyjGW?p=preview */
            var klass = element.attr('class');
            element.removeClass(className);
            var timings = fn();
            element.attr('class', klass);
            return timings;
          });

          if(cancellationMethod) {
            afterReflow(element, function() {
              unblockTransitions(element, className);
              unblockKeyframeAnimations(element);
              animationCompleted();
            });
            return cancellationMethod;
          }
          animationCompleted();
        },

        removeClass : function(element, className, animationCompleted) {
          return animateAfter('removeClass', element, suffixClasses(className, '-remove'), animationCompleted);
        }
      };

      function suffixClasses(classes, suffix) {
        var className = '';
        classes = angular.isArray(classes) ? classes : classes.split(/\s+/);
        forEach(classes, function(klass, i) {
          if(klass && klass.length > 0) {
            className += (i > 0 ? ' ' : '') + klass + suffix;
          }
        });
        return className;
      }
    }]);
  }]);


})(window, window.angular);

/**
 * @license AngularJS v1.3.13
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

  var $resourceMinErr = angular.$$minErr('$resource');

// Helper functions and regex to lookup a dotted path on an object
// stopping at undefined/null.  The path must be composed of ASCII
// identifiers (just like $parse)
  var MEMBER_NAME_REGEX = /^(\.[a-zA-Z_$][0-9a-zA-Z_$]*)+$/;

  function isValidDottedPath(path) {
    return (path != null && path !== '' && path !== 'hasOwnProperty' &&
    MEMBER_NAME_REGEX.test('.' + path));
  }

  function lookupDottedPath(obj, path) {
    if (!isValidDottedPath(path)) {
      throw $resourceMinErr('badmember', 'Dotted member path "@{0}" is invalid.', path);
    }
    var keys = path.split('.');
    for (var i = 0, ii = keys.length; i < ii && obj !== undefined; i++) {
      var key = keys[i];
      obj = (obj !== null) ? obj[key] : undefined;
    }
    return obj;
  }

  /**
   * Create a shallow copy of an object and clear other fields from the destination
   */
  function shallowClearAndCopy(src, dst) {
    dst = dst || {};

    angular.forEach(dst, function(value, key) {
      delete dst[key];
    });

    for (var key in src) {
      if (src.hasOwnProperty(key) && !(key.charAt(0) === '$' && key.charAt(1) === '$')) {
        dst[key] = src[key];
      }
    }

    return dst;
  }

  /**
   * @ngdoc module
   * @name ngResource
   * @description
   *
   * # ngResource
   *
   * The `ngResource` module provides interaction support with RESTful services
   * via the $resource service.
   *
   *
   * <div doc-module-components="ngResource"></div>
   *
   * See {@link ngResource.$resource `$resource`} for usage.
   */

  /**
   * @ngdoc service
   * @name $resource
   * @requires $http
   *
   * @description
   * A factory which creates a resource object that lets you interact with
   * [RESTful](http://en.wikipedia.org/wiki/Representational_State_Transfer) server-side data sources.
   *
   * The returned resource object has action methods which provide high-level behaviors without
   * the need to interact with the low level {@link ng.$http $http} service.
   *
   * Requires the {@link ngResource `ngResource`} module to be installed.
   *
   * By default, trailing slashes will be stripped from the calculated URLs,
   * which can pose problems with server backends that do not expect that
   * behavior.  This can be disabled by configuring the `$resourceProvider` like
   * this:
   *
   * ```js
   app.config(['$resourceProvider', function($resourceProvider) {
       // Don't strip trailing slashes from calculated URLs
       $resourceProvider.defaults.stripTrailingSlashes = false;
     }]);
   * ```
   *
   * @param {string} url A parametrized URL template with parameters prefixed by `:` as in
   *   `/user/:username`. If you are using a URL with a port number (e.g.
   *   `http://example.com:8080/api`), it will be respected.
   *
   *   If you are using a url with a suffix, just add the suffix, like this:
   *   `$resource('http://example.com/resource.json')` or `$resource('http://example.com/:id.json')`
   *   or even `$resource('http://example.com/resource/:resource_id.:format')`
   *   If the parameter before the suffix is empty, :resource_id in this case, then the `/.` will be
   *   collapsed down to a single `.`.  If you need this sequence to appear and not collapse then you
   *   can escape it with `/\.`.
   *
   * @param {Object=} paramDefaults Default values for `url` parameters. These can be overridden in
   *   `actions` methods. If any of the parameter value is a function, it will be executed every time
   *   when a param value needs to be obtained for a request (unless the param was overridden).
   *
   *   Each key value in the parameter object is first bound to url template if present and then any
   *   excess keys are appended to the url search query after the `?`.
   *
   *   Given a template `/path/:verb` and parameter `{verb:'greet', salutation:'Hello'}` results in
   *   URL `/path/greet?salutation=Hello`.
   *
   *   If the parameter value is prefixed with `@` then the value for that parameter will be extracted
   *   from the corresponding property on the `data` object (provided when calling an action method).  For
   *   example, if the `defaultParam` object is `{someParam: '@someProp'}` then the value of `someParam`
   *   will be `data.someProp`.
   *
   * @param {Object.<Object>=} actions Hash with declaration of custom actions that should extend
   *   the default set of resource actions. The declaration should be created in the format of {@link
    *   ng.$http#usage $http.config}:
   *
   *       {action1: {method:?, params:?, isArray:?, headers:?, ...},
 *        action2: {method:?, params:?, isArray:?, headers:?, ...},
 *        ...}
   *
   *   Where:
   *
   *   - **`action`** – {string} – The name of action. This name becomes the name of the method on
   *     your resource object.
   *   - **`method`** – {string} – Case insensitive HTTP method (e.g. `GET`, `POST`, `PUT`,
   *     `DELETE`, `JSONP`, etc).
   *   - **`params`** – {Object=} – Optional set of pre-bound parameters for this action. If any of
   *     the parameter value is a function, it will be executed every time when a param value needs to
   *     be obtained for a request (unless the param was overridden).
   *   - **`url`** – {string} – action specific `url` override. The url templating is supported just
   *     like for the resource-level urls.
   *   - **`isArray`** – {boolean=} – If true then the returned object for this action is an array,
   *     see `returns` section.
   *   - **`transformRequest`** –
   *     `{function(data, headersGetter)|Array.<function(data, headersGetter)>}` –
   *     transform function or an array of such functions. The transform function takes the http
   *     request body and headers and returns its transformed (typically serialized) version.
   *     By default, transformRequest will contain one function that checks if the request data is
   *     an object and serializes to using `angular.toJson`. To prevent this behavior, set
   *     `transformRequest` to an empty array: `transformRequest: []`
   *   - **`transformResponse`** –
   *     `{function(data, headersGetter)|Array.<function(data, headersGetter)>}` –
   *     transform function or an array of such functions. The transform function takes the http
   *     response body and headers and returns its transformed (typically deserialized) version.
   *     By default, transformResponse will contain one function that checks if the response looks like
   *     a JSON string and deserializes it using `angular.fromJson`. To prevent this behavior, set
   *     `transformResponse` to an empty array: `transformResponse: []`
   *   - **`cache`** – `{boolean|Cache}` – If true, a default $http cache will be used to cache the
   *     GET request, otherwise if a cache instance built with
   *     {@link ng.$cacheFactory $cacheFactory}, this cache will be used for
   *     caching.
   *   - **`timeout`** – `{number|Promise}` – timeout in milliseconds, or {@link ng.$q promise} that
   *     should abort the request when resolved.
   *   - **`withCredentials`** - `{boolean}` - whether to set the `withCredentials` flag on the
   *     XHR object. See
   *     [requests with credentials](https://developer.mozilla.org/en/http_access_control#section_5)
   *     for more information.
   *   - **`responseType`** - `{string}` - see
   *     [requestType](https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest#responseType).
   *   - **`interceptor`** - `{Object=}` - The interceptor object has two optional methods -
   *     `response` and `responseError`. Both `response` and `responseError` interceptors get called
   *     with `http response` object. See {@link ng.$http $http interceptors}.
   *
   * @param {Object} options Hash with custom settings that should extend the
   *   default `$resourceProvider` behavior.  The only supported option is
   *
   *   Where:
   *
   *   - **`stripTrailingSlashes`** – {boolean} – If true then the trailing
   *   slashes from any calculated URL will be stripped. (Defaults to true.)
   *
   * @returns {Object} A resource "class" object with methods for the default set of resource actions
   *   optionally extended with custom `actions`. The default set contains these actions:
   *   ```js
   *   { 'get':    {method:'GET'},
 *     'save':   {method:'POST'},
 *     'query':  {method:'GET', isArray:true},
 *     'remove': {method:'DELETE'},
 *     'delete': {method:'DELETE'} };
   *   ```
   *
   *   Calling these methods invoke an {@link ng.$http} with the specified http method,
   *   destination and parameters. When the data is returned from the server then the object is an
   *   instance of the resource class. The actions `save`, `remove` and `delete` are available on it
   *   as  methods with the `$` prefix. This allows you to easily perform CRUD operations (create,
   *   read, update, delete) on server-side data like this:
   *   ```js
   *   var User = $resource('/user/:userId', {userId:'@id'});
   *   var user = User.get({userId:123}, function() {
 *     user.abc = true;
 *     user.$save();
 *   });
   *   ```
   *
   *   It is important to realize that invoking a $resource object method immediately returns an
   *   empty reference (object or array depending on `isArray`). Once the data is returned from the
   *   server the existing reference is populated with the actual data. This is a useful trick since
   *   usually the resource is assigned to a model which is then rendered by the view. Having an empty
   *   object results in no rendering, once the data arrives from the server then the object is
   *   populated with the data and the view automatically re-renders itself showing the new data. This
   *   means that in most cases one never has to write a callback function for the action methods.
   *
   *   The action methods on the class object or instance object can be invoked with the following
   *   parameters:
   *
   *   - HTTP GET "class" actions: `Resource.action([parameters], [success], [error])`
   *   - non-GET "class" actions: `Resource.action([parameters], postData, [success], [error])`
   *   - non-GET instance actions:  `instance.$action([parameters], [success], [error])`
   *
   *   Success callback is called with (value, responseHeaders) arguments. Error callback is called
   *   with (httpResponse) argument.
   *
   *   Class actions return empty instance (with additional properties below).
   *   Instance actions return promise of the action.
   *
   *   The Resource instances and collection have these additional properties:
   *
   *   - `$promise`: the {@link ng.$q promise} of the original server interaction that created this
   *     instance or collection.
   *
   *     On success, the promise is resolved with the same resource instance or collection object,
   *     updated with data from server. This makes it easy to use in
   *     {@link ngRoute.$routeProvider resolve section of $routeProvider.when()} to defer view
   *     rendering until the resource(s) are loaded.
   *
   *     On failure, the promise is resolved with the {@link ng.$http http response} object, without
   *     the `resource` property.
   *
   *     If an interceptor object was provided, the promise will instead be resolved with the value
   *     returned by the interceptor.
   *
   *   - `$resolved`: `true` after first server interaction is completed (either with success or
   *      rejection), `false` before that. Knowing if the Resource has been resolved is useful in
   *      data-binding.
   *
   * @example
   *
   * # Credit card resource
   *
   * ```js
   // Define CreditCard class
   var CreditCard = $resource('/user/:userId/card/:cardId',
   {userId:123, cardId:'@id'}, {
       charge: {method:'POST', params:{charge:true}}
      });

   // We can retrieve a collection from the server
   var cards = CreditCard.query(function() {
       // GET: /user/123/card
       // server returns: [ {id:456, number:'1234', name:'Smith'} ];

       var card = cards[0];
       // each item is an instance of CreditCard
       expect(card instanceof CreditCard).toEqual(true);
       card.name = "J. Smith";
       // non GET methods are mapped onto the instances
       card.$save();
       // POST: /user/123/card/456 {id:456, number:'1234', name:'J. Smith'}
       // server returns: {id:456, number:'1234', name: 'J. Smith'};

       // our custom method is mapped as well.
       card.$charge({amount:9.99});
       // POST: /user/123/card/456?amount=9.99&charge=true {id:456, number:'1234', name:'J. Smith'}
     });

   // we can create an instance as well
   var newCard = new CreditCard({number:'0123'});
   newCard.name = "Mike Smith";
   newCard.$save();
   // POST: /user/123/card {number:'0123', name:'Mike Smith'}
   // server returns: {id:789, number:'0123', name: 'Mike Smith'};
   expect(newCard.id).toEqual(789);
   * ```
   *
   * The object returned from this function execution is a resource "class" which has "static" method
   * for each action in the definition.
   *
   * Calling these methods invoke `$http` on the `url` template with the given `method`, `params` and
   * `headers`.
   * When the data is returned from the server then the object is an instance of the resource type and
   * all of the non-GET methods are available with `$` prefix. This allows you to easily support CRUD
   * operations (create, read, update, delete) on server-side data.

   ```js
   var User = $resource('/user/:userId', {userId:'@id'});
   User.get({userId:123}, function(user) {
       user.abc = true;
       user.$save();
     });
   ```
   *
   * It's worth noting that the success callback for `get`, `query` and other methods gets passed
   * in the response that came from the server as well as $http header getter function, so one
   * could rewrite the above example and get access to http headers as:
   *
   ```js
   var User = $resource('/user/:userId', {userId:'@id'});
   User.get({userId:123}, function(u, getResponseHeaders){
       u.abc = true;
       u.$save(function(u, putResponseHeaders) {
         //u => saved user object
         //putResponseHeaders => $http header getter
       });
     });
   ```
   *
   * You can also access the raw `$http` promise via the `$promise` property on the object returned
   *
   ```
   var User = $resource('/user/:userId', {userId:'@id'});
   User.get({userId:123})
   .$promise.then(function(user) {
           $scope.user = user;
         });
   ```

   * # Creating a custom 'PUT' request
   * In this example we create a custom method on our resource to make a PUT request
   * ```js
   *    var app = angular.module('app', ['ngResource', 'ngRoute']);
   *
   *    // Some APIs expect a PUT request in the format URL/object/ID
   *    // Here we are creating an 'update' method
   *    app.factory('Notes', ['$resource', function($resource) {
 *    return $resource('/notes/:id', null,
 *        {
 *            'update': { method:'PUT' }
 *        });
 *    }]);
   *
   *    // In our controller we get the ID from the URL using ngRoute and $routeParams
   *    // We pass in $routeParams and our Notes factory along with $scope
   *    app.controller('NotesCtrl', ['$scope', '$routeParams', 'Notes',
   function($scope, $routeParams, Notes) {
 *    // First get a note object from the factory
 *    var note = Notes.get({ id:$routeParams.id });
 *    $id = note.id;
 *
 *    // Now call update passing in the ID first then the object you are updating
 *    Notes.update({ id:$id }, note);
 *
 *    // This will PUT /notes/ID with the note object in the request payload
 *    }]);
   * ```
   */
  angular.module('ngResource', ['ng']).
    provider('$resource', function() {
      var provider = this;

      this.defaults = {
        // Strip slashes by default
        stripTrailingSlashes: true,

        // Default actions configuration
        actions: {
          'get': {method: 'GET'},
          'save': {method: 'POST'},
          'query': {method: 'GET', isArray: true},
          'remove': {method: 'DELETE'},
          'delete': {method: 'DELETE'}
        }
      };

      this.$get = ['$http', '$q', function($http, $q) {

        var noop = angular.noop,
          forEach = angular.forEach,
          extend = angular.extend,
          copy = angular.copy,
          isFunction = angular.isFunction;

        /**
         * We need our custom method because encodeURIComponent is too aggressive and doesn't follow
         * http://www.ietf.org/rfc/rfc3986.txt with regards to the character set
         * (pchar) allowed in path segments:
         *    segment       = *pchar
         *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
         *    pct-encoded   = "%" HEXDIG HEXDIG
         *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
         *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
         *                     / "*" / "+" / "," / ";" / "="
         */
        function encodeUriSegment(val) {
          return encodeUriQuery(val, true).
            replace(/%26/gi, '&').
            replace(/%3D/gi, '=').
            replace(/%2B/gi, '+');
        }


        /**
         * This method is intended for encoding *key* or *value* parts of query component. We need a
         * custom method because encodeURIComponent is too aggressive and encodes stuff that doesn't
         * have to be encoded per http://tools.ietf.org/html/rfc3986:
         *    query       = *( pchar / "/" / "?" )
         *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
         *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
         *    pct-encoded   = "%" HEXDIG HEXDIG
         *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
         *                     / "*" / "+" / "," / ";" / "="
         */
        function encodeUriQuery(val, pctEncodeSpaces) {
          return encodeURIComponent(val).
            replace(/%40/gi, '@').
            replace(/%3A/gi, ':').
            replace(/%24/g, '$').
            replace(/%2C/gi, ',').
            replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
        }

        function Route(template, defaults) {
          this.template = template;
          this.defaults = extend({}, provider.defaults, defaults);
          this.urlParams = {};
        }

        Route.prototype = {
          setUrlParams: function(config, params, actionUrl) {
            var self = this,
              url = actionUrl || self.template,
              val,
              encodedVal;

            var urlParams = self.urlParams = {};
            forEach(url.split(/\W/), function(param) {
              if (param === 'hasOwnProperty') {
                throw $resourceMinErr('badname', "hasOwnProperty is not a valid parameter name.");
              }
              if (!(new RegExp("^\\d+$").test(param)) && param &&
                (new RegExp("(^|[^\\\\]):" + param + "(\\W|$)").test(url))) {
                urlParams[param] = true;
              }
            });
            url = url.replace(/\\:/g, ':');

            params = params || {};
            forEach(self.urlParams, function(_, urlParam) {
              val = params.hasOwnProperty(urlParam) ? params[urlParam] : self.defaults[urlParam];
              if (angular.isDefined(val) && val !== null) {
                encodedVal = encodeUriSegment(val);
                url = url.replace(new RegExp(":" + urlParam + "(\\W|$)", "g"), function(match, p1) {
                  return encodedVal + p1;
                });
              } else {
                url = url.replace(new RegExp("(\/?):" + urlParam + "(\\W|$)", "g"), function(match,
                                                                                             leadingSlashes, tail) {
                  if (tail.charAt(0) == '/') {
                    return tail;
                  } else {
                    return leadingSlashes + tail;
                  }
                });
              }
            });

            // strip trailing slashes and set the url (unless this behavior is specifically disabled)
            if (self.defaults.stripTrailingSlashes) {
              url = url.replace(/\/+$/, '') || '/';
            }

            // then replace collapse `/.` if found in the last URL path segment before the query
            // E.g. `http://url.com/id./format?q=x` becomes `http://url.com/id.format?q=x`
            url = url.replace(/\/\.(?=\w+($|\?))/, '.');
            // replace escaped `/\.` with `/.`
            config.url = url.replace(/\/\\\./, '/.');


            // set params - delegate param encoding to $http
            forEach(params, function(value, key) {
              if (!self.urlParams[key]) {
                config.params = config.params || {};
                config.params[key] = value;
              }
            });
          }
        };


        function resourceFactory(url, paramDefaults, actions, options) {
          var route = new Route(url, options);

          actions = extend({}, provider.defaults.actions, actions);

          function extractParams(data, actionParams) {
            var ids = {};
            actionParams = extend({}, paramDefaults, actionParams);
            forEach(actionParams, function(value, key) {
              if (isFunction(value)) { value = value(); }
              ids[key] = value && value.charAt && value.charAt(0) == '@' ?
                lookupDottedPath(data, value.substr(1)) : value;
            });
            return ids;
          }

          function defaultResponseInterceptor(response) {
            return response.resource;
          }

          function Resource(value) {
            shallowClearAndCopy(value || {}, this);
          }

          Resource.prototype.toJSON = function() {
            var data = extend({}, this);
            delete data.$promise;
            delete data.$resolved;
            return data;
          };

          forEach(actions, function(action, name) {
            var hasBody = /^(POST|PUT|PATCH)$/i.test(action.method);

            Resource[name] = function(a1, a2, a3, a4) {
              var params = {}, data, success, error;

              /* jshint -W086 */ /* (purposefully fall through case statements) */
              switch (arguments.length) {
                case 4:
                  error = a4;
                  success = a3;
                //fallthrough
                case 3:
                case 2:
                  if (isFunction(a2)) {
                    if (isFunction(a1)) {
                      success = a1;
                      error = a2;
                      break;
                    }

                    success = a2;
                    error = a3;
                    //fallthrough
                  } else {
                    params = a1;
                    data = a2;
                    success = a3;
                    break;
                  }
                case 1:
                  if (isFunction(a1)) success = a1;
                  else if (hasBody) data = a1;
                  else params = a1;
                  break;
                case 0: break;
                default:
                  throw $resourceMinErr('badargs',
                    "Expected up to 4 arguments [params, data, success, error], got {0} arguments",
                    arguments.length);
              }
              /* jshint +W086 */ /* (purposefully fall through case statements) */

              var isInstanceCall = this instanceof Resource;
              var value = isInstanceCall ? data : (action.isArray ? [] : new Resource(data));
              var httpConfig = {};
              var responseInterceptor = action.interceptor && action.interceptor.response ||
                defaultResponseInterceptor;
              var responseErrorInterceptor = action.interceptor && action.interceptor.responseError ||
                undefined;

              forEach(action, function(value, key) {
                if (key != 'params' && key != 'isArray' && key != 'interceptor') {
                  httpConfig[key] = copy(value);
                }
              });

              if (hasBody) httpConfig.data = data;
              route.setUrlParams(httpConfig,
                extend({}, extractParams(data, action.params || {}), params),
                action.url);

              var promise = $http(httpConfig).then(function(response) {
                var data = response.data,
                  promise = value.$promise;

                if (data) {
                  // Need to convert action.isArray to boolean in case it is undefined
                  // jshint -W018
                  if (angular.isArray(data) !== (!!action.isArray)) {
                    throw $resourceMinErr('badcfg',
                      'Error in resource configuration for action `{0}`. Expected response to ' +
                      'contain an {1} but got an {2}', name, action.isArray ? 'array' : 'object',
                      angular.isArray(data) ? 'array' : 'object');
                  }
                  // jshint +W018
                  if (action.isArray) {
                    value.length = 0;
                    forEach(data, function(item) {
                      if (typeof item === "object") {
                        value.push(new Resource(item));
                      } else {
                        // Valid JSON values may be string literals, and these should not be converted
                        // into objects. These items will not have access to the Resource prototype
                        // methods, but unfortunately there
                        value.push(item);
                      }
                    });
                  } else {
                    shallowClearAndCopy(data, value);
                    value.$promise = promise;
                  }
                }

                value.$resolved = true;

                response.resource = value;

                return response;
              }, function(response) {
                value.$resolved = true;

                (error || noop)(response);

                return $q.reject(response);
              });

              promise = promise.then(
                function(response) {
                  var value = responseInterceptor(response);
                  (success || noop)(value, response.headers);
                  return value;
                },
                responseErrorInterceptor);

              if (!isInstanceCall) {
                // we are creating instance / collection
                // - set the initial promise
                // - return the instance / collection
                value.$promise = promise;
                value.$resolved = false;

                return value;
              }

              // instance call
              return promise;
            };


            Resource.prototype['$' + name] = function(params, success, error) {
              if (isFunction(params)) {
                error = success; success = params; params = {};
              }
              var result = Resource[name].call(this, params, this, success, error);
              return result.$promise || result;
            };
          });

          Resource.bind = function(additionalParamDefaults) {
            return resourceFactory(url, extend({}, paramDefaults, additionalParamDefaults), actions);
          };

          return Resource;
        }

        return resourceFactory;
      }];
    });


})(window, window.angular);
/**
 * @license AngularJS v1.3.13
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

  /**
   * @ngdoc module
   * @name ngRoute
   * @description
   *
   * # ngRoute
   *
   * The `ngRoute` module provides routing and deeplinking services and directives for angular apps.
   *
   * ## Example
   * See {@link ngRoute.$route#example $route} for an example of configuring and using `ngRoute`.
   *
   *
   * <div doc-module-components="ngRoute"></div>
   */
  /* global -ngRouteModule */
  var ngRouteModule = angular.module('ngRoute', ['ng']).
      provider('$route', $RouteProvider),
    $routeMinErr = angular.$$minErr('ngRoute');

  /**
   * @ngdoc provider
   * @name $routeProvider
   *
   * @description
   *
   * Used for configuring routes.
   *
   * ## Example
   * See {@link ngRoute.$route#example $route} for an example of configuring and using `ngRoute`.
   *
   * ## Dependencies
   * Requires the {@link ngRoute `ngRoute`} module to be installed.
   */
  function $RouteProvider() {
    function inherit(parent, extra) {
      return angular.extend(Object.create(parent), extra);
    }

    var routes = {};

    /**
     * @ngdoc method
     * @name $routeProvider#when
     *
     * @param {string} path Route path (matched against `$location.path`). If `$location.path`
     *    contains redundant trailing slash or is missing one, the route will still match and the
     *    `$location.path` will be updated to add or drop the trailing slash to exactly match the
     *    route definition.
     *
     *    * `path` can contain named groups starting with a colon: e.g. `:name`. All characters up
     *        to the next slash are matched and stored in `$routeParams` under the given `name`
     *        when the route matches.
     *    * `path` can contain named groups starting with a colon and ending with a star:
     *        e.g.`:name*`. All characters are eagerly stored in `$routeParams` under the given `name`
     *        when the route matches.
     *    * `path` can contain optional named groups with a question mark: e.g.`:name?`.
     *
     *    For example, routes like `/color/:color/largecode/:largecode*\/edit` will match
     *    `/color/brown/largecode/code/with/slashes/edit` and extract:
     *
     *    * `color: brown`
     *    * `largecode: code/with/slashes`.
     *
     *
     * @param {Object} route Mapping information to be assigned to `$route.current` on route
     *    match.
     *
     *    Object properties:
     *
     *    - `controller` – `{(string|function()=}` – Controller fn that should be associated with
     *      newly created scope or the name of a {@link angular.Module#controller registered
   *      controller} if passed as a string.
     *    - `controllerAs` – `{string=}` – A controller alias name. If present the controller will be
     *      published to scope under the `controllerAs` name.
     *    - `template` – `{string=|function()=}` – html template as a string or a function that
     *      returns an html template as a string which should be used by {@link
      *      ngRoute.directive:ngView ngView} or {@link ng.directive:ngInclude ngInclude} directives.
     *      This property takes precedence over `templateUrl`.
     *
     *      If `template` is a function, it will be called with the following parameters:
     *
     *      - `{Array.<Object>}` - route parameters extracted from the current
     *        `$location.path()` by applying the current route
     *
     *    - `templateUrl` – `{string=|function()=}` – path or function that returns a path to an html
     *      template that should be used by {@link ngRoute.directive:ngView ngView}.
     *
     *      If `templateUrl` is a function, it will be called with the following parameters:
     *
     *      - `{Array.<Object>}` - route parameters extracted from the current
     *        `$location.path()` by applying the current route
     *
     *    - `resolve` - `{Object.<string, function>=}` - An optional map of dependencies which should
     *      be injected into the controller. If any of these dependencies are promises, the router
     *      will wait for them all to be resolved or one to be rejected before the controller is
     *      instantiated.
     *      If all the promises are resolved successfully, the values of the resolved promises are
     *      injected and {@link ngRoute.$route#$routeChangeSuccess $routeChangeSuccess} event is
     *      fired. If any of the promises are rejected the
     *      {@link ngRoute.$route#$routeChangeError $routeChangeError} event is fired. The map object
     *      is:
     *
     *      - `key` – `{string}`: a name of a dependency to be injected into the controller.
     *      - `factory` - `{string|function}`: If `string` then it is an alias for a service.
     *        Otherwise if function, then it is {@link auto.$injector#invoke injected}
     *        and the return value is treated as the dependency. If the result is a promise, it is
     *        resolved before its value is injected into the controller. Be aware that
     *        `ngRoute.$routeParams` will still refer to the previous route within these resolve
     *        functions.  Use `$route.current.params` to access the new route parameters, instead.
     *
     *    - `redirectTo` – {(string|function())=} – value to update
     *      {@link ng.$location $location} path with and trigger route redirection.
     *
     *      If `redirectTo` is a function, it will be called with the following parameters:
     *
     *      - `{Object.<string>}` - route parameters extracted from the current
     *        `$location.path()` by applying the current route templateUrl.
     *      - `{string}` - current `$location.path()`
     *      - `{Object}` - current `$location.search()`
     *
     *      The custom `redirectTo` function is expected to return a string which will be used
     *      to update `$location.path()` and `$location.search()`.
     *
     *    - `[reloadOnSearch=true]` - {boolean=} - reload route when only `$location.search()`
     *      or `$location.hash()` changes.
     *
     *      If the option is set to `false` and url in the browser changes, then
     *      `$routeUpdate` event is broadcasted on the root scope.
     *
     *    - `[caseInsensitiveMatch=false]` - {boolean=} - match routes without being case sensitive
     *
     *      If the option is set to `true`, then the particular route can be matched without being
     *      case sensitive
     *
     * @returns {Object} self
     *
     * @description
     * Adds a new route definition to the `$route` service.
     */
    this.when = function(path, route) {
      //copy original route object to preserve params inherited from proto chain
      var routeCopy = angular.copy(route);
      if (angular.isUndefined(routeCopy.reloadOnSearch)) {
        routeCopy.reloadOnSearch = true;
      }
      if (angular.isUndefined(routeCopy.caseInsensitiveMatch)) {
        routeCopy.caseInsensitiveMatch = this.caseInsensitiveMatch;
      }
      routes[path] = angular.extend(
        routeCopy,
        path && pathRegExp(path, routeCopy)
      );

      // create redirection for trailing slashes
      if (path) {
        var redirectPath = (path[path.length - 1] == '/')
          ? path.substr(0, path.length - 1)
          : path + '/';

        routes[redirectPath] = angular.extend(
          {redirectTo: path},
          pathRegExp(redirectPath, routeCopy)
        );
      }

      return this;
    };

    /**
     * @ngdoc property
     * @name $routeProvider#caseInsensitiveMatch
     * @description
     *
     * A boolean property indicating if routes defined
     * using this provider should be matched using a case insensitive
     * algorithm. Defaults to `false`.
     */
    this.caseInsensitiveMatch = false;

    /**
     * @param path {string} path
     * @param opts {Object} options
     * @return {?Object}
     *
     * @description
     * Normalizes the given path, returning a regular expression
     * and the original path.
     *
     * Inspired by pathRexp in visionmedia/express/lib/utils.js.
     */
    function pathRegExp(path, opts) {
      var insensitive = opts.caseInsensitiveMatch,
        ret = {
          originalPath: path,
          regexp: path
        },
        keys = ret.keys = [];

      path = path
        .replace(/([().])/g, '\\$1')
        .replace(/(\/)?:(\w+)([\?\*])?/g, function(_, slash, key, option) {
          var optional = option === '?' ? option : null;
          var star = option === '*' ? option : null;
          keys.push({ name: key, optional: !!optional });
          slash = slash || '';
          return ''
            + (optional ? '' : slash)
            + '(?:'
            + (optional ? slash : '')
            + (star && '(.+?)' || '([^/]+)')
            + (optional || '')
            + ')'
            + (optional || '');
        })
        .replace(/([\/$\*])/g, '\\$1');

      ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
      return ret;
    }

    /**
     * @ngdoc method
     * @name $routeProvider#otherwise
     *
     * @description
     * Sets route definition that will be used on route change when no other route definition
     * is matched.
     *
     * @param {Object|string} params Mapping information to be assigned to `$route.current`.
     * If called with a string, the value maps to `redirectTo`.
     * @returns {Object} self
     */
    this.otherwise = function(params) {
      if (typeof params === 'string') {
        params = {redirectTo: params};
      }
      this.when(null, params);
      return this;
    };


    this.$get = ['$rootScope',
      '$location',
      '$routeParams',
      '$q',
      '$injector',
      '$templateRequest',
      '$sce',
      function($rootScope, $location, $routeParams, $q, $injector, $templateRequest, $sce) {

        /**
         * @ngdoc service
         * @name $route
         * @requires $location
         * @requires $routeParams
         *
         * @property {Object} current Reference to the current route definition.
         * The route definition contains:
         *
         *   - `controller`: The controller constructor as define in route definition.
         *   - `locals`: A map of locals which is used by {@link ng.$controller $controller} service for
         *     controller instantiation. The `locals` contain
         *     the resolved values of the `resolve` map. Additionally the `locals` also contain:
         *
         *     - `$scope` - The current route scope.
         *     - `$template` - The current route template HTML.
         *
         * @property {Object} routes Object with all route configuration Objects as its properties.
         *
         * @description
         * `$route` is used for deep-linking URLs to controllers and views (HTML partials).
         * It watches `$location.url()` and tries to map the path to an existing route definition.
         *
         * Requires the {@link ngRoute `ngRoute`} module to be installed.
         *
         * You can define routes through {@link ngRoute.$routeProvider $routeProvider}'s API.
         *
         * The `$route` service is typically used in conjunction with the
         * {@link ngRoute.directive:ngView `ngView`} directive and the
         * {@link ngRoute.$routeParams `$routeParams`} service.
         *
         * @example
         * This example shows how changing the URL hash causes the `$route` to match a route against the
         * URL, and the `ngView` pulls in the partial.
         *
         * <example name="$route-service" module="ngRouteExample"
         *          deps="angular-route.js" fixBase="true">
         *   <file name="index.html">
         *     <div ng-controller="MainController">
         *       Choose:
         *       <a href="Book/Moby">Moby</a> |
         *       <a href="Book/Moby/ch/1">Moby: Ch1</a> |
         *       <a href="Book/Gatsby">Gatsby</a> |
         *       <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
         *       <a href="Book/Scarlet">Scarlet Letter</a><br/>
         *
         *       <div ng-view></div>
         *
         *       <hr />
         *
         *       <pre>$location.path() = {{$location.path()}}</pre>
         *       <pre>$route.current.templateUrl = {{$route.current.templateUrl}}</pre>
         *       <pre>$route.current.params = {{$route.current.params}}</pre>
         *       <pre>$route.current.scope.name = {{$route.current.scope.name}}</pre>
         *       <pre>$routeParams = {{$routeParams}}</pre>
         *     </div>
         *   </file>
         *
         *   <file name="book.html">
         *     controller: {{name}}<br />
         *     Book Id: {{params.bookId}}<br />
         *   </file>
         *
         *   <file name="chapter.html">
         *     controller: {{name}}<br />
         *     Book Id: {{params.bookId}}<br />
         *     Chapter Id: {{params.chapterId}}
         *   </file>
         *
         *   <file name="script.js">
         *     angular.module('ngRouteExample', ['ngRoute'])
         *
         *      .controller('MainController', function($scope, $route, $routeParams, $location) {
     *          $scope.$route = $route;
     *          $scope.$location = $location;
     *          $scope.$routeParams = $routeParams;
     *      })
         *
         *      .controller('BookController', function($scope, $routeParams) {
     *          $scope.name = "BookController";
     *          $scope.params = $routeParams;
     *      })
         *
         *      .controller('ChapterController', function($scope, $routeParams) {
     *          $scope.name = "ChapterController";
     *          $scope.params = $routeParams;
     *      })
         *
         *     .config(function($routeProvider, $locationProvider) {
     *       $routeProvider
     *        .when('/Book/:bookId', {
     *         templateUrl: 'book.html',
     *         controller: 'BookController',
     *         resolve: {
     *           // I will cause a 1 second delay
     *           delay: function($q, $timeout) {
     *             var delay = $q.defer();
     *             $timeout(delay.resolve, 1000);
     *             return delay.promise;
     *           }
     *         }
     *       })
     *       .when('/Book/:bookId/ch/:chapterId', {
     *         templateUrl: 'chapter.html',
     *         controller: 'ChapterController'
     *       });
     *
     *       // configure html5 to get links working on jsfiddle
     *       $locationProvider.html5Mode(true);
     *     });
         *
         *   </file>
         *
         *   <file name="protractor.js" type="protractor">
         *     it('should load and compile correct template', function() {
     *       element(by.linkText('Moby: Ch1')).click();
     *       var content = element(by.css('[ng-view]')).getText();
     *       expect(content).toMatch(/controller\: ChapterController/);
     *       expect(content).toMatch(/Book Id\: Moby/);
     *       expect(content).toMatch(/Chapter Id\: 1/);
     *
     *       element(by.partialLinkText('Scarlet')).click();
     *
     *       content = element(by.css('[ng-view]')).getText();
     *       expect(content).toMatch(/controller\: BookController/);
     *       expect(content).toMatch(/Book Id\: Scarlet/);
     *     });
         *   </file>
         * </example>
         */

        /**
         * @ngdoc event
         * @name $route#$routeChangeStart
         * @eventType broadcast on root scope
         * @description
         * Broadcasted before a route change. At this  point the route services starts
         * resolving all of the dependencies needed for the route change to occur.
         * Typically this involves fetching the view template as well as any dependencies
         * defined in `resolve` route property. Once  all of the dependencies are resolved
         * `$routeChangeSuccess` is fired.
         *
         * The route change (and the `$location` change that triggered it) can be prevented
         * by calling `preventDefault` method of the event. See {@link ng.$rootScope.Scope#$on}
         * for more details about event object.
         *
         * @param {Object} angularEvent Synthetic event object.
         * @param {Route} next Future route information.
         * @param {Route} current Current route information.
         */

        /**
         * @ngdoc event
         * @name $route#$routeChangeSuccess
         * @eventType broadcast on root scope
         * @description
         * Broadcasted after a route dependencies are resolved.
         * {@link ngRoute.directive:ngView ngView} listens for the directive
         * to instantiate the controller and render the view.
         *
         * @param {Object} angularEvent Synthetic event object.
         * @param {Route} current Current route information.
         * @param {Route|Undefined} previous Previous route information, or undefined if current is
         * first route entered.
         */

        /**
         * @ngdoc event
         * @name $route#$routeChangeError
         * @eventType broadcast on root scope
         * @description
         * Broadcasted if any of the resolve promises are rejected.
         *
         * @param {Object} angularEvent Synthetic event object
         * @param {Route} current Current route information.
         * @param {Route} previous Previous route information.
         * @param {Route} rejection Rejection of the promise. Usually the error of the failed promise.
         */

        /**
         * @ngdoc event
         * @name $route#$routeUpdate
         * @eventType broadcast on root scope
         * @description
         *
         * The `reloadOnSearch` property has been set to false, and we are reusing the same
         * instance of the Controller.
         */

        var forceReload = false,
          preparedRoute,
          preparedRouteIsUpdateOnly,
          $route = {
            routes: routes,

            /**
             * @ngdoc method
             * @name $route#reload
             *
             * @description
             * Causes `$route` service to reload the current route even if
             * {@link ng.$location $location} hasn't changed.
             *
             * As a result of that, {@link ngRoute.directive:ngView ngView}
             * creates new scope and reinstantiates the controller.
             */
            reload: function() {
              forceReload = true;
              $rootScope.$evalAsync(function() {
                // Don't support cancellation of a reload for now...
                prepareRoute();
                commitRoute();
              });
            },

            /**
             * @ngdoc method
             * @name $route#updateParams
             *
             * @description
             * Causes `$route` service to update the current URL, replacing
             * current route parameters with those specified in `newParams`.
             * Provided property names that match the route's path segment
             * definitions will be interpolated into the location's path, while
             * remaining properties will be treated as query params.
             *
             * @param {!Object<string, string>} newParams mapping of URL parameter names to values
             */
            updateParams: function(newParams) {
              if (this.current && this.current.$$route) {
                newParams = angular.extend({}, this.current.params, newParams);
                $location.path(interpolate(this.current.$$route.originalPath, newParams));
                // interpolate modifies newParams, only query params are left
                $location.search(newParams);
              } else {
                throw $routeMinErr('norout', 'Tried updating route when with no current route');
              }
            }
          };

        $rootScope.$on('$locationChangeStart', prepareRoute);
        $rootScope.$on('$locationChangeSuccess', commitRoute);

        return $route;

        /////////////////////////////////////////////////////

        /**
         * @param on {string} current url
         * @param route {Object} route regexp to match the url against
         * @return {?Object}
         *
         * @description
         * Check if the route matches the current url.
         *
         * Inspired by match in
         * visionmedia/express/lib/router/router.js.
         */
        function switchRouteMatcher(on, route) {
          var keys = route.keys,
            params = {};

          if (!route.regexp) return null;

          var m = route.regexp.exec(on);
          if (!m) return null;

          for (var i = 1, len = m.length; i < len; ++i) {
            var key = keys[i - 1];

            var val = m[i];

            if (key && val) {
              params[key.name] = val;
            }
          }
          return params;
        }

        function prepareRoute($locationEvent) {
          var lastRoute = $route.current;

          preparedRoute = parseRoute();
          preparedRouteIsUpdateOnly = preparedRoute && lastRoute && preparedRoute.$$route === lastRoute.$$route
          && angular.equals(preparedRoute.pathParams, lastRoute.pathParams)
          && !preparedRoute.reloadOnSearch && !forceReload;

          if (!preparedRouteIsUpdateOnly && (lastRoute || preparedRoute)) {
            if ($rootScope.$broadcast('$routeChangeStart', preparedRoute, lastRoute).defaultPrevented) {
              if ($locationEvent) {
                $locationEvent.preventDefault();
              }
            }
          }
        }

        function commitRoute() {
          var lastRoute = $route.current;
          var nextRoute = preparedRoute;

          if (preparedRouteIsUpdateOnly) {
            lastRoute.params = nextRoute.params;
            angular.copy(lastRoute.params, $routeParams);
            $rootScope.$broadcast('$routeUpdate', lastRoute);
          } else if (nextRoute || lastRoute) {
            forceReload = false;
            $route.current = nextRoute;
            if (nextRoute) {
              if (nextRoute.redirectTo) {
                if (angular.isString(nextRoute.redirectTo)) {
                  $location.path(interpolate(nextRoute.redirectTo, nextRoute.params)).search(nextRoute.params)
                    .replace();
                } else {
                  $location.url(nextRoute.redirectTo(nextRoute.pathParams, $location.path(), $location.search()))
                    .replace();
                }
              }
            }

            $q.when(nextRoute).
              then(function() {
                if (nextRoute) {
                  var locals = angular.extend({}, nextRoute.resolve),
                    template, templateUrl;

                  angular.forEach(locals, function(value, key) {
                    locals[key] = angular.isString(value) ?
                      $injector.get(value) : $injector.invoke(value, null, null, key);
                  });

                  if (angular.isDefined(template = nextRoute.template)) {
                    if (angular.isFunction(template)) {
                      template = template(nextRoute.params);
                    }
                  } else if (angular.isDefined(templateUrl = nextRoute.templateUrl)) {
                    if (angular.isFunction(templateUrl)) {
                      templateUrl = templateUrl(nextRoute.params);
                    }
                    templateUrl = $sce.getTrustedResourceUrl(templateUrl);
                    if (angular.isDefined(templateUrl)) {
                      nextRoute.loadedTemplateUrl = templateUrl;
                      template = $templateRequest(templateUrl);
                    }
                  }
                  if (angular.isDefined(template)) {
                    locals['$template'] = template;
                  }
                  return $q.all(locals);
                }
              }).
              // after route change
              then(function(locals) {
                if (nextRoute == $route.current) {
                  if (nextRoute) {
                    nextRoute.locals = locals;
                    angular.copy(nextRoute.params, $routeParams);
                  }
                  $rootScope.$broadcast('$routeChangeSuccess', nextRoute, lastRoute);
                }
              }, function(error) {
                if (nextRoute == $route.current) {
                  $rootScope.$broadcast('$routeChangeError', nextRoute, lastRoute, error);
                }
              });
          }
        }


        /**
         * @returns {Object} the current active route, by matching it against the URL
         */
        function parseRoute() {
          // Match a route
          var params, match;
          angular.forEach(routes, function(route, path) {
            if (!match && (params = switchRouteMatcher($location.path(), route))) {
              match = inherit(route, {
                params: angular.extend({}, $location.search(), params),
                pathParams: params});
              match.$$route = route;
            }
          });
          // No route matched; fallback to "otherwise" route
          return match || routes[null] && inherit(routes[null], {params: {}, pathParams:{}});
        }

        /**
         * @returns {string} interpolation of the redirect path with the parameters
         */
        function interpolate(string, params) {
          var result = [];
          angular.forEach((string || '').split(':'), function(segment, i) {
            if (i === 0) {
              result.push(segment);
            } else {
              var segmentMatch = segment.match(/(\w+)(?:[?*])?(.*)/);
              var key = segmentMatch[1];
              result.push(params[key]);
              result.push(segmentMatch[2] || '');
              delete params[key];
            }
          });
          return result.join('');
        }
      }];
  }

  ngRouteModule.provider('$routeParams', $RouteParamsProvider);


  /**
   * @ngdoc service
   * @name $routeParams
   * @requires $route
   *
   * @description
   * The `$routeParams` service allows you to retrieve the current set of route parameters.
   *
   * Requires the {@link ngRoute `ngRoute`} module to be installed.
   *
   * The route parameters are a combination of {@link ng.$location `$location`}'s
   * {@link ng.$location#search `search()`} and {@link ng.$location#path `path()`}.
   * The `path` parameters are extracted when the {@link ngRoute.$route `$route`} path is matched.
   *
   * In case of parameter name collision, `path` params take precedence over `search` params.
   *
   * The service guarantees that the identity of the `$routeParams` object will remain unchanged
   * (but its properties will likely change) even when a route change occurs.
   *
   * Note that the `$routeParams` are only updated *after* a route change completes successfully.
   * This means that you cannot rely on `$routeParams` being correct in route resolve functions.
   * Instead you can use `$route.current.params` to access the new route's parameters.
   *
   * @example
   * ```js
   *  // Given:
   *  // URL: http://server.com/index.html#/Chapter/1/Section/2?search=moby
   *  // Route: /Chapter/:chapterId/Section/:sectionId
   *  //
   *  // Then
   *  $routeParams ==> {chapterId:'1', sectionId:'2', search:'moby'}
   * ```
   */
  function $RouteParamsProvider() {
    this.$get = function() { return {}; };
  }

  ngRouteModule.directive('ngView', ngViewFactory);
  ngRouteModule.directive('ngView', ngViewFillContentFactory);


  /**
   * @ngdoc directive
   * @name ngView
   * @restrict ECA
   *
   * @description
   * # Overview
   * `ngView` is a directive that complements the {@link ngRoute.$route $route} service by
   * including the rendered template of the current route into the main layout (`index.html`) file.
   * Every time the current route changes, the included view changes with it according to the
   * configuration of the `$route` service.
   *
   * Requires the {@link ngRoute `ngRoute`} module to be installed.
   *
   * @animations
   * enter - animation is used to bring new content into the browser.
   * leave - animation is used to animate existing content away.
   *
   * The enter and leave animation occur concurrently.
   *
   * @scope
   * @priority 400
   * @param {string=} onload Expression to evaluate whenever the view updates.
   *
   * @param {string=} autoscroll Whether `ngView` should call {@link ng.$anchorScroll
 *                  $anchorScroll} to scroll the viewport after the view is updated.
   *
   *                  - If the attribute is not set, disable scrolling.
   *                  - If the attribute is set without value, enable scrolling.
   *                  - Otherwise enable scrolling only if the `autoscroll` attribute value evaluated
   *                    as an expression yields a truthy value.
   * @example
   <example name="ngView-directive" module="ngViewExample"
   deps="angular-route.js;angular-animate.js"
   animations="true" fixBase="true">
   <file name="index.html">
   <div ng-controller="MainCtrl as main">
   Choose:
   <a href="Book/Moby">Moby</a> |
   <a href="Book/Moby/ch/1">Moby: Ch1</a> |
   <a href="Book/Gatsby">Gatsby</a> |
   <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
   <a href="Book/Scarlet">Scarlet Letter</a><br/>

   <div class="view-animate-container">
   <div ng-view class="view-animate"></div>
   </div>
   <hr />

   <pre>$location.path() = {{main.$location.path()}}</pre>
   <pre>$route.current.templateUrl = {{main.$route.current.templateUrl}}</pre>
   <pre>$route.current.params = {{main.$route.current.params}}</pre>
   <pre>$routeParams = {{main.$routeParams}}</pre>
   </div>
   </file>

   <file name="book.html">
   <div>
   controller: {{book.name}}<br />
   Book Id: {{book.params.bookId}}<br />
   </div>
   </file>

   <file name="chapter.html">
   <div>
   controller: {{chapter.name}}<br />
   Book Id: {{chapter.params.bookId}}<br />
   Chapter Id: {{chapter.params.chapterId}}
   </div>
   </file>

   <file name="animations.css">
   .view-animate-container {
          position:relative;
          height:100px!important;
          background:white;
          border:1px solid black;
          height:40px;
          overflow:hidden;
        }

   .view-animate {
          padding:10px;
        }

   .view-animate.ng-enter, .view-animate.ng-leave {
          -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;
          transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;

          display:block;
          width:100%;
          border-left:1px solid black;

          position:absolute;
          top:0;
          left:0;
          right:0;
          bottom:0;
          padding:10px;
        }

   .view-animate.ng-enter {
          left:100%;
        }
   .view-animate.ng-enter.ng-enter-active {
          left:0;
        }
   .view-animate.ng-leave.ng-leave-active {
          left:-100%;
        }
   </file>

   <file name="script.js">
   angular.module('ngViewExample', ['ngRoute', 'ngAnimate'])
   .config(['$routeProvider', '$locationProvider',
   function($routeProvider, $locationProvider) {
              $routeProvider
                .when('/Book/:bookId', {
                  templateUrl: 'book.html',
                  controller: 'BookCtrl',
                  controllerAs: 'book'
                })
                .when('/Book/:bookId/ch/:chapterId', {
                  templateUrl: 'chapter.html',
                  controller: 'ChapterCtrl',
                  controllerAs: 'chapter'
                });

              $locationProvider.html5Mode(true);
          }])
   .controller('MainCtrl', ['$route', '$routeParams', '$location',
   function($route, $routeParams, $location) {
              this.$route = $route;
              this.$location = $location;
              this.$routeParams = $routeParams;
          }])
   .controller('BookCtrl', ['$routeParams', function($routeParams) {
            this.name = "BookCtrl";
            this.params = $routeParams;
          }])
   .controller('ChapterCtrl', ['$routeParams', function($routeParams) {
            this.name = "ChapterCtrl";
            this.params = $routeParams;
          }]);

   </file>

   <file name="protractor.js" type="protractor">
   it('should load and compile correct template', function() {
          element(by.linkText('Moby: Ch1')).click();
          var content = element(by.css('[ng-view]')).getText();
          expect(content).toMatch(/controller\: ChapterCtrl/);
          expect(content).toMatch(/Book Id\: Moby/);
          expect(content).toMatch(/Chapter Id\: 1/);

          element(by.partialLinkText('Scarlet')).click();

          content = element(by.css('[ng-view]')).getText();
          expect(content).toMatch(/controller\: BookCtrl/);
          expect(content).toMatch(/Book Id\: Scarlet/);
        });
   </file>
   </example>
   */


  /**
   * @ngdoc event
   * @name ngView#$viewContentLoaded
   * @eventType emit on the current ngView scope
   * @description
   * Emitted every time the ngView content is reloaded.
   */
  ngViewFactory.$inject = ['$route', '$anchorScroll', '$animate'];
  function ngViewFactory($route, $anchorScroll, $animate) {
    return {
      restrict: 'ECA',
      terminal: true,
      priority: 400,
      transclude: 'element',
      link: function(scope, $element, attr, ctrl, $transclude) {
        var currentScope,
          currentElement,
          previousLeaveAnimation,
          autoScrollExp = attr.autoscroll,
          onloadExp = attr.onload || '';

        scope.$on('$routeChangeSuccess', update);
        update();

        function cleanupLastView() {
          if (previousLeaveAnimation) {
            $animate.cancel(previousLeaveAnimation);
            previousLeaveAnimation = null;
          }

          if (currentScope) {
            currentScope.$destroy();
            currentScope = null;
          }
          if (currentElement) {
            previousLeaveAnimation = $animate.leave(currentElement);
            previousLeaveAnimation.then(function() {
              previousLeaveAnimation = null;
            });
            currentElement = null;
          }
        }

        function update() {
          var locals = $route.current && $route.current.locals,
            template = locals && locals.$template;

          if (angular.isDefined(template)) {
            var newScope = scope.$new();
            var current = $route.current;

            // Note: This will also link all children of ng-view that were contained in the original
            // html. If that content contains controllers, ... they could pollute/change the scope.
            // However, using ng-view on an element with additional content does not make sense...
            // Note: We can't remove them in the cloneAttchFn of $transclude as that
            // function is called before linking the content, which would apply child
            // directives to non existing elements.
            var clone = $transclude(newScope, function(clone) {
              $animate.enter(clone, null, currentElement || $element).then(function onNgViewEnter() {
                if (angular.isDefined(autoScrollExp)
                  && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                  $anchorScroll();
                }
              });
              cleanupLastView();
            });

            currentElement = clone;
            currentScope = current.scope = newScope;
            currentScope.$emit('$viewContentLoaded');
            currentScope.$eval(onloadExp);
          } else {
            cleanupLastView();
          }
        }
      }
    };
  }

// This directive is called during the $transclude call of the first `ngView` directive.
// It will replace and compile the content of the element with the loaded template.
// We need this directive so that the element content is already filled when
// the link function of another directive on the same element as ngView
// is called.
  ngViewFillContentFactory.$inject = ['$compile', '$controller', '$route'];
  function ngViewFillContentFactory($compile, $controller, $route) {
    return {
      restrict: 'ECA',
      priority: -400,
      link: function(scope, $element) {
        var current = $route.current,
          locals = current.locals;

        $element.html(locals.$template);

        var link = $compile($element.contents());

        if (current.controller) {
          locals.$scope = scope;
          var controller = $controller(current.controller, locals);
          if (current.controllerAs) {
            scope[current.controllerAs] = controller;
          }
          $element.data('$ngControllerController', controller);
          $element.children().data('$ngControllerController', controller);
        }

        link(scope);
      }
    };
  }


})(window, window.angular);
'use strict';

(function() {

  /**
   * @ngdoc overview
   * @name ngStorage
   */

  angular.module('ngStorage', []).

  /**
   * @ngdoc object
   * @name ngStorage.$localStorage
   * @requires $rootScope
   * @requires $window
   */

    factory('$localStorage', _storageFactory('localStorage')).

  /**
   * @ngdoc object
   * @name ngStorage.$sessionStorage
   * @requires $rootScope
   * @requires $window
   */

    factory('$sessionStorage', _storageFactory('sessionStorage'));

  function _storageFactory(storageType) {
    return [
      '$rootScope',
      '$window',
      '$log',

      function(
        $rootScope,
        $window,
        $log
      ){
        // #9: Assign a placeholder object if Web Storage is unavailable to prevent breaking the entire AngularJS app
        var webStorage = $window[storageType] || ($log.warn('This browser does not support Web Storage!'), {}),
          $storage = {
            $default: function(items) {
              for (var k in items) {
                angular.isDefined($storage[k]) || ($storage[k] = items[k]);
              }

              return $storage;
            },
            $reset: function(items) {
              for (var k in $storage) {
                '$' === k[0] || delete $storage[k];
              }

              return $storage.$default(items);
            }
          },
          _last$storage,
          _debounce;

        for (var i = 0, k; i < webStorage.length; i++) {
          // #8, #10: `webStorage.key(i)` may be an empty string (or throw an exception in IE9 if `webStorage` is empty)
          (k = webStorage.key(i)) && 'ngStorage-' === k.slice(0, 10) && ($storage[k.slice(10)] = angular.fromJson(webStorage.getItem(k)));
        }

        _last$storage = angular.copy($storage);

        $rootScope.$watch(function() {
          _debounce || (_debounce = setTimeout(function() {
            _debounce = null;

            if (!angular.equals($storage, _last$storage)) {
              angular.forEach($storage, function(v, k) {
                angular.isDefined(v) && '$' !== k[0] && webStorage.setItem('ngStorage-' + k, angular.toJson(v));

                delete _last$storage[k];
              });

              for (var k in _last$storage) {
                webStorage.removeItem('ngStorage-' + k);
              }

              _last$storage = angular.copy($storage);
            }
          }, 100));
        });

        // #6: Use `$window.addEventListener` instead of `angular.element` to avoid the jQuery-specific `event.originalEvent`
        'localStorage' === storageType && $window.addEventListener && $window.addEventListener('storage', function(event) {
          if ('ngStorage-' === event.key.slice(0, 10)) {
            event.newValue ? $storage[event.key.slice(10)] = angular.fromJson(event.newValue) : delete $storage[event.key.slice(10)];

            _last$storage = angular.copy($storage);

            $rootScope.$apply();
          }
        });

        return $storage;
      }
    ];
  }

})();

/**
 * General-purpose Event binding. Bind any event not natively supported by Angular
 * Pass an object with keynames for events to ui-event
 * Allows $event object and $params object to be passed
 *
 * @example <input ui-event="{ focus : 'counter++', blur : 'someCallback()' }">
 * @example <input ui-event="{ myCustomEvent : 'myEventHandler($event, $params)'}">
 *
 * @param ui-event {string|object literal} The event to bind to as a string or a hash of events with their callbacks
 */
angular.module('ui.event',[]).directive('uiEvent', ['$parse',
  function ($parse) {
    return function ($scope, elm, attrs) {
      var events = $scope.$eval(attrs.uiEvent);
      angular.forEach(events, function (uiEvent, eventName) {
        var fn = $parse(uiEvent);
        elm.bind(eventName, function (evt) {
          var params = Array.prototype.slice.call(arguments);
          //Take out first paramater (event object);
          params = params.splice(1);
          fn($scope, {$event: evt, $params: params});
          if (!$scope.$$phase) {
            $scope.$apply();
          }
        });
      });
    };
  }]);

/**
 * angular-ui-map - This directive allows you to add map elements.
 * @version v0.0.3 - 2013-05-22
 * @link http://angular-ui.github.com
 * @license MIT
 */
(function(){function e(e,n,o,i){angular.forEach(n.split(" "),function(n){google.maps.event.addListener(o,n,function(o){i.triggerHandler("map-"+n,o),e.$$phase||e.$apply()})})}function n(n,i){o.directive(n,[function(){return{restrict:"A",link:function(o,c,a){o.$watch(a[n],function(n){n&&e(o,i,n,c)})}}}])}var o=angular.module("ui.map",["ui.event"]);o.value("uiMapConfig",{}).directive("uiMap",["uiMapConfig","$parse",function(n,o){var i="bounds_changed center_changed click dblclick drag dragend dragstart heading_changed idle maptypeid_changed mousemove mouseout mouseover projection_changed resize rightclick tilesloaded tilt_changed zoom_changed",c=n||{};return{restrict:"A",link:function(n,a,u){var d=angular.extend({},c,n.$eval(u.uiOptions)),t=new google.maps.Map(a[0],d),l=o(u.uiMap);l.assign(n,t),e(n,i,t,a)}}}]),o.value("uiMapInfoWindowConfig",{}).directive("uiMapInfoWindow",["uiMapInfoWindowConfig","$parse","$compile",function(n,o,i){var c="closeclick content_change domready position_changed zindex_changed",a=n||{};return{link:function(n,u,d){var t=angular.extend({},a,n.$eval(d.uiOptions));t.content=u[0];var l=o(d.uiMapInfoWindow),r=l(n);r||(r=new google.maps.InfoWindow(t),l.assign(n,r)),e(n,c,r,u),u.replaceWith("<div></div>");var g=r.open;r.open=function(e,o,c,a,d,t){i(u.contents())(n),g.call(r,e,o,c,a,d,t)}}}}]),n("uiMapMarker","animation_changed click clickable_changed cursor_changed dblclick drag dragend draggable_changed dragstart flat_changed icon_changed mousedown mouseout mouseover mouseup position_changed rightclick shadow_changed shape_changed title_changed visible_changed zindex_changed"),n("uiMapPolyline","click dblclick mousedown mousemove mouseout mouseover mouseup rightclick"),n("uiMapPolygon","click dblclick mousedown mousemove mouseout mouseover mouseup rightclick"),n("uiMapRectangle","bounds_changed click dblclick mousedown mousemove mouseout mouseover mouseup rightclick"),n("uiMapCircle","center_changed click dblclick mousedown mousemove mouseout mouseover mouseup radius_changed rightclick"),n("uiMapGroundOverlay","click dblclick")})();
angular.module('campApp', [
    'ngRoute',
    'ngResource',
    'ngStorage',
    'appRoutes',
    //'enterStroke',
    'MainController',
    'PostController',
    'PostService',
    'UserController',
    'UserService',
    'DashboardController',
    'BoardService',
    'GeoController',
    'FotosController',
    'FotosService',
    'CalendarCtrl',
    'EventosService'
]);
$(document).on('ready', function () {
    $(".button-collapse").sideNav();
    $('.tooltipped').tooltip({delay: 50});
});
angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', '$httpProvider',
    function ($routeProvider, $locationProvider, $httpProvider) {

        /*
         * This route allow us to match CRUD / resource route
         */

        $routeProvider
                .when('/', {
                    templateUrl: '/partials/index',
                    controller: 'MainController'
                })
                .when('/:category/:action?/:id?', {
                    templateUrl: function (params) {
                        var allowedParams = ['category', 'action', 'id'];
                        var paramVals = [];
                        for (var key in params) {
                            if (allowedParams.indexOf(key) !== -1) {
                                paramVals.push(params[key]);
                            }
                        }
                        return '/partials/' + paramVals.join('/');
                    }
                })
                .otherwise({
                    redirectTo: '/'
                });

        $locationProvider.html5Mode(true);

        $httpProvider.interceptors.push(['$rootScope', '$q', '$localStorage', '$location',
            function ($rootScope, $q, $localStorage, $location) {
                return {
                    'request': function (config) {
                        config.headers = config.headers || {};
                        if ($localStorage.token) {
                            config.headers.Authorization = 'Bearer ' + $localStorage.token;
                        }
                        return config;
                    },
                    'response': function (res) {
                        if (res.status === 401 || res.status === 500) {
                            $location.path('/auth/login');
                            $location.replace();
                        }
                        return res || $q.when(res);
                    }
                };
            }
        ]);
    }
]);

angular.module("GeoController", ["ui.map", "ui.event"])
        .controller("GeoController", ['$scope', 'weatherService', function ($scope, weatherService) {
                $scope.lat = "0";
                $scope.lng = "0";
                $scope.accuracy = "0";
                $scope.error = "";
                $scope.model = {myMap: undefined};
                $scope.myMarkers = [];
                $scope.ciudad = "";
                $scope.estados = [];
                
                /*
                 * Muestra el resultado de un error
                 * @returns {Boolean}
                 */
                $scope.showResult = function () {
                    return $scope.error == "";
                }
                
                /*
                 * Opciones del mapa de google para la geolocalización
                 */
                $scope.mapOptions = {
                    center: new google.maps.LatLng($scope.lat, $scope.lng),
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                
                /*
                 * Esto es para mostrar la posición del mapa, pero no lo muestro
                 * @param {type} position
                 * @returns {undefined}
                 */
                $scope.showPosition = function (position) {
                    $scope.lat = position.coords.latitude;
                    $scope.lng = position.coords.longitude;
                    codeLatLng($scope.lat, $scope.lng);
                    $scope.accuracy = position.coords.accuracy;
                    $scope.$apply();

                    var latlng = new google.maps.LatLng($scope.lat, $scope.lng);
                    //$scope.model.myMap.setCenter(latlng);
                    $scope.myMarkers.push(new google.maps.Marker({map: $scope.model.myMap, position: latlng}));
                }

                /*
                 * En caso tal de que no se pueda localizar a la persona, toma por defecto bogotá
                 * @returns {undefined}
                 */
                $scope.showPositionDefault = function () {
                    $scope.lat = 4.710989;
                    $scope.lng = -74.072092;
                    codeLatLng($scope.lat, $scope.lng);
                    $scope.accuracy = 0;
                    $scope.$apply();

                    var latlng = new google.maps.LatLng($scope.lat, $scope.lng);
                    //$scope.model.myMap.setCenter(latlng);
                    $scope.myMarkers.push(new google.maps.Marker({map: $scope.model.myMap, position: latlng}));
                }
                
                /*
                 * Muestra el error de la localizacion del mapa
                 * @param {type} error
                 * @returns {undefined}
                 */
                $scope.showError = function (error) {
                    /*switch (error.code) {
                     case error.PERMISSION_DENIED:
                     $scope.error = "User denied the request for Geolocation."
                     break;
                     case error.POSITION_UNAVAILABLE:
                     $scope.error = "Location information is unavailable."
                     break;
                     case error.TIMEOUT:
                     $scope.error = "The request to get user location timed out."
                     break;
                     case error.UNKNOWN_ERROR:
                     $scope.error = "An unknown error occurred."
                     break;
                     }
                     $scope.$apply();*/
                    $scope.showPositionDefault();
                }

                /*
                 * Trae las coordenadas del mapa a través de geolocalización de google maps
                 * @returns {undefined}
                 */
                $scope.getLocation = function () {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
                    }
                    else {
                        $scope.error = "Geolocation is not supported by this browser.";
                    }
                }

                $scope.getLocation();

                /*
                 * Captura el nombre de la ciudad que se localizó, para después enviarselo a la api del clima
                 * @param {type} lat
                 * @param {type} lng
                 * @returns {undefined}
                 */
                function codeLatLng(lat, lng) {
                    var geocoder = new google.maps.Geocoder();
                    var latlng = new google.maps.LatLng(lat, lng);
                    geocoder.geocode({'latLng': latlng}, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            if (results[1]) {
                                //formateo de dirección
                                console.log(results[0].formatted_address);
                                //buscamos el nombre de la ciudad
                                /*for (var i = 0; i < results[0].address_components.length; i++) {
                                    for (var b = 0; b < results[0].address_components[i].types.length; b++) {

                                        //Esto lo que hace es buscar por sublocalidad un sitio en el mapa
                                        if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                                            //este el objetom que contiene la ciudad
                                            city = results[0].address_components[i];
                                            break;
                                        }
                                    }
                                }*/
                                var datosUbicacion = results[0].formatted_address.split(',');
                                //datos de la ciudad
                                //$scope.ciudad = city.short_name;
                                //viewForest(weatherService.getClima({city: 'bogotá', state: 'córdoba', country: 'colombia'}));
                                weatherService.getClima({city: datosUbicacion[1].trim(), state: datosUbicacion[3].trim(), country: datosUbicacion[4].trim()})
                                        .then(viewForest);
                                //console.log(city.short_name + " " + city.long_name);
                            } else {
                                alert("No results found");
                            }
                        } else {
                            alert("Geocoder failed due to: " + status);
                        }
                    });
                }

                var gradesC = function (input) {
                    var grados = (input - 32) / 1.8;
                    if (grados % 1 != 0) {
                        grados = grados.toFixed(1);
                    }
                    return grados + '°C ';
                };


                var weatherIconMap = ['storm', 'storm', 'storm', 'lightning', 'lightning', 'snow', 'hail', 'hail',
                    'drizzle', 'drizzle', 'rain', 'rain', 'rain', 'snow', 'snow', 'snow', 'snow',
                    'hail', 'hail', 'fog', 'fog', 'fog', 'fog', 'wind', 'wind', 'snowflake',
                    'cloud', 'cloud_moon', 'cloud_sun', 'cloud_moon', 'cloud_sun', 'moon', 'sun',
                    'moon', 'sun', 'hail', 'sun', 'lightning', 'lightning', 'lightning', 'rain',
                    'snowflake', 'snowflake', 'snowflake', 'cloud', 'rain', 'snow', 'lightning'
                ];

                var weatherDiv = $('#weather'),
                        scroller = $('#scroller'),
                        location = $('p.location');

                function viewForest(r) {
                    var r = r.data;
                    var hoy = r.query.results.channel.item.condition;
                    //var hoy = r.query.results.channel.item.forecast[0];
                    //AGREGAR EL ESTADO DEL TIEMPO
                    addWeather(hoy.code, "Hoy", hoy.text + ' ' + gradesC(hoy.temp));
                    for (var i = 1; i < 3; i++) {
                        var pronosticos = r.query.results.channel.item.forecast[i];
                        addWeather(
                                pronosticos.code,
                                pronosticos.day + ', ' + pronosticos.date.replace('\d+$', ''),
                                pronosticos.text + ' ' + gradesC(pronosticos.low) + ' ' + gradesC(pronosticos.high)
                                );
                    }

                    // Add the location to the page
                    location.html(r.query.results.channel.location.city + ', <b>' + r.query.results.channel.location.country + '</b>');

                    weatherDiv.addClass('loaded');

                    // Set the slider to the first slide
                    showSlide(0);
                    ///////
                }

                function addWeather(code, day, condition) {
                    $scope.estados.push(
                            {
                                img: weatherIconMap[code],
                                day: day,
                                condition: condition,
                            }
                    );
                    /*var markup = '<li>' +
                     '<img src="../images/icons/' + weatherIconMap[code] + '.png" />' +
                     ' <span class="day">' + day + '</span> <span class="cond">' + condition +
                     '</span></li>';*/

                    //scroller.append(markup);
                }

                /* Handling the previous / next arrows */

                var currentSlide = 0;
                weatherDiv.find('a.previous').click(function (e) {
                    e.preventDefault();
                    showSlide(currentSlide - 1);
                });

                weatherDiv.find('a.next').click(function (e) {
                    e.preventDefault();
                    showSlide(currentSlide + 1);
                });


                function showSlide(i) {
                    var items = scroller.find('li');

                    if (i >= items.length || i < 0 || scroller.is(':animated')) {
                        return false;
                    }

                    weatherDiv.removeClass('first last');

                    if (i == 0) {
                        weatherDiv.addClass('first');
                    }
                    else if (i == items.length - 1) {
                        weatherDiv.addClass('last');
                    }

                    scroller.animate({left: (-i * 100) + '%'}, function () {
                        currentSlide = i;
                    });
                }

            }])
                .service('weatherService', function ($http, $q, $rootScope) {
                    var getQuery = function (location) {
                        var query = 'select * from weather.forecast where woeid in ' + '(select woeid from geo.places(1) where text="4.710989, -74.072092")';

                        query = query.replace('city', location.city)
                                //.replace('state', location.state)
                                 .replace('country', location.country);
                        console.log(query);
                        return query;
                    }

                    var getUrl = function (location) {
                        var baseUrl = 'https://query.yahooapis.com/v1/public/yql?q=';
                        var extUrl = '&format=json&env=store://datatables.org/alltableswithkeys&callback=JSON_CALLBACK';
                        var query = encodeURIComponent(getQuery(location));
                        var finalUrl = baseUrl + query + extUrl;
                        return finalUrl;
                    }

                    // implementation
                    this.getClima = function (location) {
                        var def = $q.defer();
                        var url = getUrl(location);
                        return $http.jsonp(url).success(function (data) {
                            def.resolve(data);
                        }).error(function () {
                            def.reject("Failed to get albums");
                        });
                        return def.promise;
                    }

                })
angular.module('DashboardController', []).controller('DashboardController', ['$scope', 'Board', '$localStorage', '$location',
    function ($scope, Board, $localStorage, $location) {
        $scope.board = function () {
            var splitPath = $location.path().split('/');
            var userUrl = splitPath[splitPath.length - 1];
            $scope.board = Board.get({userUrl: userUrl});
            
            $(document).ready(function () {
                $('.slider').slider({full_width: true});
            });
        };
    }
]);


/**
 * calendarDemoApp - 0.9.0
 */
var eventos = angular.module('CalendarCtrl', ['ui.calendar'])
        .controller('CalendarCtrl', CalendarCtrl);

function CalendarCtrl($scope, $compile, $timeout, uiCalendarConfig, Eventos, serviceEventos) {
    $scope.events = [];
    $scope.proximos = [];
    $scope.getEventos = function () {
        serviceEventos.getEventos($scope.authenticatedUser.id).then(mostrarEventos);
    }
    function mostrarEventos(datos) {
        for (var i = 0; i < datos.data.length; i++) {
            $scope.events.push({
                title: datos.data[i].title,
                start: datos.data[i].start,
                end: datos.data[i].end,
                id: datos.data[i].id
            })
        }
    }
    /* alert on eventClick */
    $scope.alertOnEventClick = function (date, jsEvent, view) {
        $scope.info = date;
        $('#infoEvento').openModal();
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function (sources, source) {
        var canAdd = 0;
        angular.forEach(sources, function (value, key) {
            console.log(sources[key])
            if (sources[key] === source) {
                sources.splice(key, 1);
                canAdd = 1;
            }
        });
        if (canAdd === 0) {
            sources.push(source);
        }
    };
    $scope.addEvent = function (objNewEvent) {
        $scope.events.push(objNewEvent);
        toastr.success('Agregaste un nuevo evento!');
        $scope.nuevoEvento = null;
    };

    /* store event */
    $scope.guardarEvento = function () {
        var eventDefault = $scope.nuevoEvento;
        var objNewEvent = {
            title: $scope.nuevoEvento.descripcion,
            start: $scope.nuevoEvento.fecha1 + ' ' + $scope.nuevoEvento.hora1,
            end: $scope.nuevoEvento.fecha2 + ' ' + $scope.nuevoEvento.hora2,
            className: ['openSesame']
        };
        if ($scope.agregarEvento.$valid) {
            var evento = new Eventos({
                user_id: $scope.authenticatedUser.id,
                title: $scope.nuevoEvento.descripcion,
                start: $scope.nuevoEvento.fecha1 + ' ' + $scope.nuevoEvento.hora1,
                end: $scope.nuevoEvento.fecha2 + ' ' + $scope.nuevoEvento.hora2,
            });
            evento.$save(function (data) {
                $scope.nuevoEvento = angular.copy(eventDefault);
                $scope.agregarEvento.$setPristine();
                $('#addEvent').closeModal();
                $scope.addEvent(objNewEvent);
            }, function (err) {
                toastr.error('Ups!, hubo un error!');
                console.log(err);
            });
        }
    };
    $scope.remove = function (index) {
        $scope.events.splice(index, 1);
    }
    /* remove event */
    $scope.eliminaEvento = function (index) {
        var idEliminar = this.info.id;
        $.each($scope.events, function (index, value) {
            if (value.id == idEliminar) {
                $scope.remove(index);
            }
        });
        Eventos.remove({userId: idEliminar}, function (res) {
            $('#infoEvento').closeModal();
            toastr.success('Eliminaste un evento!');
        }, function (err) {
            toastr.error('Ups!, hubo un error eliminando el evento!');
        });
    };
    function mostrarProximos(proximosEventos) {
        angular.forEach(proximosEventos.data, function (value, key) {
            value.start = new Date(value.start);
            value.end = new Date(value.end);
            $scope.proximos.push(value);
        });
    }
    /* proximos eventos */
    $scope.proximosEventos = function () {
        serviceEventos.getProximos($scope.authenticatedUser.id).then(mostrarProximos);
    }
    /* config object */
    $scope.uiConfig = {
        calendar: {
            editable: false,
            header: {
                center: 'title',
                left: 'today prev,next',
                right: ''
            },
            eventClick: $scope.alertOnEventClick,
            //eventDrop: $scope.alertOnDrop,
            eventDrop: false,
            //eventResize: $scope.alertOnResize,
            eventResize: false,
            //eventRender: $scope.eventRender,
            eventRender: false,
            dayNames: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado"],
            dayNamesShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sáb"],
        }
    };
    /* event sources array*/
    $scope.eventSources = [$scope.events];


    $scope.actualizarAsistencia = function ($event) {
        Eventos.update({
            id: $event.target.id,
            asistio: $event.target.checked
        }, function (res) {
            toastr.success('Actualizaste la asistencia a un evento!')
        }, function (err) {
            toastr.error('Ups!, hubo un error!')
            console.log(err);
        });
    };

    $scope.eventosAsistidos = function () {
        serviceEventos.getAsistidos($scope.authenticatedUser.id).then(function (data) {
            $scope.asistidos = data.data;
        }, function (err) {
            toastr.error('Ups!, No pudimos saber a cuantos eventos has asistido!')
            console.log(err);
        });
    };


    $(document).on('click', '.fc-prev-button', function () {
        $scope.getEventos();
    });
    $(document).on('click', '.fc-next-button', function () {
        $scope.getEventos();
    });
}
/* EOF */

eventos.filter('numeroEventos', function () {
    return function (input) {
        return input>1 || input < 1 ? input + ' eventos' : input + ' evento';
    };
});
var myApp = angular.module('Exlorador', ['infinite-scroll']);

myApp.controller('ExloradorController', function($scope) {
  $scope.images = [1, 2, 3, 4, 5, 6, 7, 8];

  $scope.loadMore = function() {
    var last = $scope.images[$scope.images.length - 1];
    for(var i = 1; i <= 8; i++) {
      $scope.images.push(last + i);
    }
  };
});
angular.module('FotosController', [])
        .controller('FotosController', ['$scope', 'Foto', '$localStorage', '$location', '$route',
            function ($scope, Foto, $localStorage, $location, $route) {

                $scope.create = function () {
                    if ($scope.addFoto.$valid) {
                        var foto = new Foto({
                            imagen: this.newFoto,
                            user_id: $scope.authenticatedUser.id
                        });
                        foto.$save(function (foto) {
                            $scope.nameFile = null;
                            $scope.newFoto = null;
                            $('#modalAdd').closeModal();
                            $scope.refFotos();
                        }, function (err) {
                            toastr.error('Ups!, hubo un error!');
                            console.log(err);
                        });
                    }
                };
                $scope.refFotos = function () {
                    //window.location.reload();
                    toastr.options.onShown = function () {
                        $route.reload();
                    }
                    toastr.success('Tú foto se agregó!');
                }

                $scope.getFotos = function () {
                    /*var splitPath = $location.path().split('/');
                     var userId = splitPath[1];*/
                    Foto.getFotos({userId: $scope.authenticatedUser.id}, function (data) {
                        $scope.fotos = data;
                        $scope.authenticatedUser.fotos = $scope.fotos.length;
                        // success handler
                    }, function (error) {
                        toastr.error('Ups!, no te podemos cargar las fotos!');
                        console.log(error);
                        if (error.status === 401 || error.status === 500) {
                            $location.path('/auth/login');
                            $location.replace();
                        }
                    });
                };

                $scope.viewLoaded = function () {
                    alert('view load sussefully')
                    $('.slider').addClass('fullscreen');
                };
            }
        ])
        .directive('appFilereader', function (
                $q
                ) {
            /*
             made by elmerbulthuis@gmail.com WTFPL licensed
             */
            var slice = Array.prototype.slice;
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function (scope, element, attrs, ngModel) {
                    if (!ngModel)
                        return;
                    ngModel.$render = function () {
                    }

                    element.bind('change', function (e) {
                        var element = e.target;
                        if (!element.value)
                            return;
                        element.disabled = true;
                        $q.all(slice.call(element.files, 0).map(readFile))
                                .then(function (values) {
                                    /*if (element.multiple) ngModel.$setViewValue(values);
                                     else ngModel.$setViewValue(values.length ? values[0] : null);*/
                                    ngModel.$setViewValue(values.length ? values[0] : null);
                                    element.value = null;
                                    element.disabled = false;
                                });
                        function readFile(file) {
                            var deferred = $q.defer();
                            var reader = new FileReader()
                            reader.onload = function (e) {
                                deferred.resolve(e.target.result);
                            }
                            reader.onerror = function (e) {
                                deferred.reject(e);
                            }
                            reader.readAsDataURL(file);
                            return deferred.promise;
                        }

                    }); //change

                } //link

            }; //return

        })
        .directive('myRepeatDirective', function () {
            return function (scope, element, attrs) {
                if (scope.$last) {
                    $('.slider').slider();
                }
            };
        })
        .filter('numeroFotos', function () {
            return function (input) {
                return input > 1 ? input + ' fotos' : input + ' foto';
            };
        });
angular.module('MainController', []).controller('MainController', ['$scope', '$location', '$localStorage', 'User',
    function ($scope, $location, $localStorage, User) {
        /**
         * Responsible for highlighting the currently active menu item in the navbar.
         *
         * @param route
         * @returns {boolean}
         */
        $scope.isActive = function (route) {
            return route === $location.path();
        };

        /**
         * Query the authenticated user by the Authorization token from the header.
         *
         * @param user {object} If provided, it won't query from database, but take this one.
         * @returns {null}
         */
        $scope.getAuthenticatedUser = function (user) {
            if (user) {
                $scope.authenticatedUser = user;
                return;
            }

            if (typeof $localStorage.token === 'undefined') {
                return null;
            }

            new User().$getByToken(function (user) {
                $scope.authenticatedUser = user;
            }, function (err) {
                toastr.error('Ups!, se ha vencido tu sesión!');
                $scope.logout();
                if (err.status === 401 || err.status === 500) {
                    $location.path('/auth/login');
                    $location.replace();
                }
            });
        };

        $scope.logout = function () {
            delete $localStorage.token;
            $scope.authenticatedUser = null;
            $location.path('/auth/login');
            $location.replace();
        };
    }
]).filter('capitalize', function () {
    return function (input, all) {
        var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
        return (!!input) ? input.replace(reg, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }) : '';
    }
});

angular.module('PostController', []).controller('PostController', ['$scope', '$location', '$routeParams', 'Post',
    function ($scope, $location, $routeParams, Post) {
        $scope.create = function () {
            var post = new Post({
                title: this.title,
                body: this.body
            });
            post.$save(function (res) {
                $location.path('posts/show/' + res.id);
                $scope.body = '';
            }, function (err) {
                console.log(err);
            });
        };

        /*$scope.find = function () {
         $scope.posts = Post.query();
         };*/

        Post.query(function (data) {
            $scope.posts = data;
            // success handler
        }, function (error) {
            console.log(error);
            if (error.status === 401 || error.status === 500) {
                $location.path('/auth/login');
                $location.replace();
            }
        });

        $scope.remove = function (post) {
            post.$remove(function (res) {
                alert('Delete success!');
                $location.path('/posts');
            }, function (err) {
                console.log(err);
            });
        };

        $scope.update = function (post) {
            console.log(post);
            post.$update(function (res) {
                $location.path('/posts/show/' + post.id);
            }, function (err) {
                console.log(err);
            });
        };

        $scope.findOne = function () {
            var splitPath = $location.path().split('/');
            var postId = splitPath[splitPath.length - 1];
            $scope.post = Post.get({postId: postId});
        };
    }
]);

angular.module('UserController', ['infinite-scroll']).controller('UserController', ['$scope', 'User', '$localStorage', '$location',
    function ($scope, User, $localStorage, $location) {
        $scope.login = function () {
            if ($scope.loginForm.$valid) {
                var user = new User({
                    email: this.email,
                    password: this.password
                });
                user.$login(function (user) {
                    $localStorage.token = user.token;
                    $scope.getAuthenticatedUser(user);
                    $location.path(user.url);
                }, function (err) {
                    toastr.error('Ups!, no puedes ingresar!');
                    console.log(err);
                    $scope.error = err.data;
                });
            }
        };

        $scope.create = function () {
            if ($scope.registerForm.$valid) {
                if (this.password != this.passwordConfirmation) {
                    return alert('Las contraseñas no coinciden.');
                }
                var user = new User({
                    nombre: this.nombre,
                    apellidos: this.apellidos,
                    email: this.email,
                    password: this.password,
                    fecha: this.fecha
                });
                user.$save(function (user) {
                    $localStorage.token = user.token;
                    $scope.getAuthenticatedUser(user);
                    $location.path(user.url + '/perfil');
                }, function (err) {
                    toastr.error('Ups!, no te pude registrar!');
                    console.log(err);
                });
            }
        };
        $scope.user = [];
        $scope.findOne = function () {
            var splitPath = $location.path().split('/');
            var userId = splitPath[1];
            User.get({userId: userId, userIn: $scope.authenticatedUser.id}, function (data) {
                $scope.user = data;
                $scope.user.fecha = new Date($scope.user.fecha);
                $scope.user.fecha.setDate($scope.user.fecha.getDate() + 1);
                $scope.visitas = $scope.user.visitas;
                // success handler
            }, function (error) {
                toastr.error('Ups!, no se cargó el perfil!');
                console.log(error);
                if (error.status === 401 || error.status === 500) {
                    $location.path('/auth/login');
                    $location.replace();
                }
            });
        };

        $scope.getVisits = function () {
            $scope.visitas = $scope.user.visitas;
        }

        $scope.update = function (user) {
            console.log(user);
            user.$update(function (res) {
                $scope.authenticatedUser.url = user.url;
                $scope.authenticatedUser.nombre = user.nombre;
                $location.path(user.url + '/perfil');
                toastr.success('Tú perfil se actualizó!');

            }, function (err) {
                toastr.error('Ups!, hubo un error!')
                console.log(err);
            });
        };

        $scope.toggleClass = function () {
            $(".card, body").toggleClass("show-menu");
        };

        $scope.calculateAge = function (birthday) { // birthday is a date
            var birthUser = new Date(birthday);
            var ageDifMs = Date.now() - birthUser.getTime();
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        }

        $scope.ultimo = 1;
        $scope.users = [];
        $scope.findAll = function () {
            User.query({page: $scope.ultimo}, function (data) {
                //for (var i = 1; i <= $scope.users.length; i++) {
                var newData = [];
                angular.forEach(data.data, function (value, key) {
                    value.fecha = new Date(value.fecha);
                    value.fecha.setDate(value.fecha.getDate() + 1);
                    newData.push(value);
                });
                if (data.data.length > 0) {
                    $scope.users.push.apply($scope.users, newData);
                }
                $scope.ultimo = data.current_page + 1;
            }, function (error) {
                toastr.error('Ups!, no se cargaron los demás perfiles!');
                console.log(error);
                if (error.status === 401 || error.status === 500) {
                    $location.path('/auth/login');
                    $location.replace();
                }
            });
        };
        /**
         * Esta función cambia el estado de acceso de un afiliado, sólo lo puede
         * hacer el administrador
         * @param {type} $event
         * @returns {undefined}
         */
        $scope.changeEstateUser = function ($event) {
            User.update({
                id: $event.target.id,
                bloqued: $event.target.checked,
                userIn: $scope.authenticatedUser.id
            }, function (res) {
                toastr.success('Has bloquedado un usuario!')
            }, function (error) {
                if (error.status === 401) {
                    toastr.error(error.data.error);
                } else {
                    toastr.error('Ups!, hubo un error!');
                }
                console.log($event.target.checked);
                console.log(error);
            });
        };

        $scope.usersAdmin = function () {
            User.usersAdmin({userId: $scope.authenticatedUser.id}, function (data) {
                $scope.users = data.data;
            }, function (error) {
                toastr.error(error.data.error);
                if (error.status === 401 || error.status === 500) {
                    $location.path('/');
                    $location.replace();
                }
            });
        };
    }
]).directive('wjValidationError', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctl) {
            scope.$watch(attrs['wjValidationError'], function (errorMsg) {
                elm[0].setCustomValidity(errorMsg);
                ctl.$setValidity('wjValidationError', errorMsg ? false : true);
            });
        }
    };
}).directive('appFilereader', function (
        $q
        ) {
    /*
     made by elmerbulthuis@gmail.com WTFPL licensed
     */
    var slice = Array.prototype.slice;

    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {
            if (!ngModel)
                return;

            ngModel.$render = function () {
            }

            element.bind('change', function (e) {
                var element = e.target;
                if (!element.value)
                    return;

                element.disabled = true;
                $q.all(slice.call(element.files, 0).map(readFile))
                        .then(function (values) {
                            /*if (element.multiple) ngModel.$setViewValue(values);
                             else ngModel.$setViewValue(values.length ? values[0] : null);*/
                            ngModel.$setViewValue(values.length ? values[0] : null);
                            element.value = null;
                            element.disabled = false;
                        });

                function readFile(file) {
                    var deferred = $q.defer();

                    var reader = new FileReader()
                    reader.onload = function (e) {
                        deferred.resolve(e.target.result);
                    }
                    reader.onerror = function (e) {
                        deferred.reject(e);
                    }
                    reader.readAsDataURL(file);

                    return deferred.promise;
                }

            }); //change

        } //link

    }; //return

}).filter('capitalize', function () {
    return function (input, all) {
        var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
        return (!!input) ? input.replace(reg, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }) : '';
    }
}).filter('numeroVisitas', function () {
    return function (input) {
        return input > 1 || input < 1 ? input + ' veces' : input + ' vez';
    };
});
angular.module('BoardService', []).factory('Board', ['$resource',
  function ($resource) {
    return $resource('/api/perfil/', {
      userId: '@id'
    }, {
      update: {
        method: 'PUT'
      },
      login: {
        method: 'POST',
        url: '/api/user/login'
      },
      getByToken: {
        method: 'GET',
        url: '/api/user/getByToken'
      }
    });
  }
]);

angular.module('EventosService', []).factory('Eventos', ['$resource',
    function ($resource) {
        return $resource('/api/eventos/:userId', {
            userId: '@id'
        }, {
            'get': {
                method: 'GET',
                isArray: true
            },
            update: {
                method: 'PUT',
                url: '/api/eventos/update/'
            }
        });
    }
]).service('serviceEventos', function ($http, $q) {
    // implementation
    this.getEventos = function (user) {
        var def = $q.defer();
        var conf = {
            url: '/api/eventos/' + user,
        };
        return $http(conf).success(function (data) {
            def.resolve(data);
        }).error(function () {
            def.reject("Error consultando los eventos");
        });
        return def.promise;
    };

    this.getProximos = function (user) {
        var def = $q.defer();
        var conf = {
            method: 'GET',
            url: 'api/eventos/proximos/',
            params: {
                'userId': user
            }
        };
        return $http(conf).success(function (data) {
            def.resolve(data);
        }).error(function () {
            def.reject("Error consultando tus proximos eventos");
        });
        return def.promise;
    };
        
    this.getAsistidos = function (user) {
        var def = $q.defer();
        var conf = {
            method: 'GET',
            url: 'api/eventos/asistidos/',
            params: {
                'userId': user
            }
        };
        return $http(conf).success(function (data) {
            def.resolve(data);
        }).error(function () {
            def.reject("Error consultando los eventos asistidos");
        });
        return def.promise;
    };

})

angular.module('FotosService', []).factory('Foto', ['$resource',
    function ($resource) {
        return $resource('/api/foto/:userId', {
            userId: '@id'
        }, {
            'getFotos': {
                method: 'GET',
                isArray: true
            },
        });
    }
]);

angular.module('PostService', []).factory('Post', ['$resource',
    function ($resource) {
        return $resource('/api/post/:postId', {
            postId: '@id'
        }, {
            'query': {
                method: 'GET',
                isArray: false
            },
            update: {
                method: 'PUT'
            }
        });
    }
]);
angular.module('UserService', []).factory('User', ['$resource',
  function ($resource) {
    return $resource('/api/user/:userId', {
      userId: '@id'
    }, {
      update: {
        method: 'PUT'
      },
      login: {
        method: 'POST',
        url: '/api/user/login'
      },
      getByToken: {
        method: 'GET',
        url: '/api/user/getByToken'
      },
      query : {
          isArray: false
      },
      usersAdmin: {
          url: '/api/user/usersAdmin'
      }
    });
  }
]);

//# sourceMappingURL=all.js.map