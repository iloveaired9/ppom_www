/**
 * jQuery 호환 래퍼 (Vanilla JavaScript 기반)
 * 기존 jQuery 코드를 거의 수정하지 않고 사용 가능
 *
 * 사용법: 기존 jQuery 코드와 동일하게 사용
 * $(selector).on('event', callback)
 * $(selector).addClass('class')
 * ...등 모든 jQuery 메서드 호환
 */

(function(window) {
    'use strict';

    // ==========================================
    // jQuery 호환 래퍼 클래스
    // ==========================================

    class JQueryCompat {
        constructor(selector) {
            if (!selector) {
                this.elements = [];
                return;
            }

            // String selector
            if (typeof selector === 'string') {
                this.elements = Array.from(document.querySelectorAll(selector));
            }
            // Single element
            else if (selector instanceof Element) {
                this.elements = [selector];
            }
            // NodeList
            else if (selector instanceof NodeList) {
                this.elements = Array.from(selector);
            }
            // HTMLCollection
            else if (selector instanceof HTMLCollection) {
                this.elements = Array.from(selector);
            }
            // Array
            else if (Array.isArray(selector)) {
                this.elements = selector;
            }
            else {
                this.elements = [];
            }
        }

        // ==========================================
        // DOM 조작 메서드
        // ==========================================

        /**
         * 텍스트 콘텐츠 설정/조회
         */
        text(content) {
            if (content === undefined) {
                return this.elements.length > 0 ? this.elements[0].textContent : '';
            }
            this.elements.forEach(el => {
                el.textContent = content;
            });
            return this;
        }

        /**
         * HTML 콘텐츠 설정/조회
         */
        html(content) {
            if (content === undefined) {
                return this.elements.length > 0 ? this.elements[0].innerHTML : '';
            }
            this.elements.forEach(el => {
                el.innerHTML = content;
            });
            return this;
        }

        /**
         * 요소 추가
         */
        append(content) {
            this.elements.forEach(el => {
                if (typeof content === 'string') {
                    el.insertAdjacentHTML('beforeend', content);
                } else if (content instanceof Element) {
                    el.appendChild(content);
                } else if (content instanceof JQueryCompat) {
                    content.elements.forEach(child => {
                        el.appendChild(child.cloneNode(true));
                    });
                }
            });
            return this;
        }

        /**
         * 요소 앞에 추가
         */
        prepend(content) {
            this.elements.forEach(el => {
                if (typeof content === 'string') {
                    el.insertAdjacentHTML('afterbegin', content);
                } else if (content instanceof Element) {
                    el.insertBefore(content, el.firstChild);
                }
            });
            return this;
        }

        /**
         * 부모 요소에 추가
         */
        appendTo(parent) {
            const $parent = $(parent);
            this.elements.forEach(el => {
                $parent.elements.forEach(p => {
                    p.appendChild(el);
                });
            });
            return this;
        }

        /**
         * 요소 제거
         */
        remove() {
            this.elements.forEach(el => {
                el.parentNode?.removeChild(el);
            });
            return this;
        }

        /**
         * 요소 비우기
         */
        empty() {
            this.elements.forEach(el => {
                el.innerHTML = '';
            });
            return this;
        }

        // ==========================================
        // 속성 조작 메서드
        // ==========================================

        /**
         * 속성 설정/조회
         */
        attr(name, value) {
            if (value === undefined) {
                return this.elements.length > 0 ? this.elements[0].getAttribute(name) : undefined;
            }
            this.elements.forEach(el => {
                el.setAttribute(name, value);
            });
            return this;
        }

        /**
         * 데이터 속성 설정/조회
         */
        data(key, value) {
            if (value === undefined) {
                return this.elements.length > 0 ? this.elements[0].dataset[key] : undefined;
            }
            this.elements.forEach(el => {
                el.dataset[key] = value;
            });
            return this;
        }

        /**
         * 값 설정/조회
         */
        val(value) {
            if (value === undefined) {
                return this.elements.length > 0 ? this.elements[0].value : '';
            }
            this.elements.forEach(el => {
                if (el.value !== undefined) {
                    el.value = value;
                }
            });
            return this;
        }

        // ==========================================
        // 클래스 조작 메서드
        // ==========================================

        /**
         * 클래스 추가
         */
        addClass(className) {
            this.elements.forEach(el => {
                className.split(' ').forEach(cls => {
                    if (cls) el.classList.add(cls);
                });
            });
            return this;
        }

        /**
         * 클래스 제거
         */
        removeClass(className) {
            this.elements.forEach(el => {
                if (className === undefined) {
                    el.className = '';
                } else {
                    className.split(' ').forEach(cls => {
                        if (cls) el.classList.remove(cls);
                    });
                }
            });
            return this;
        }

        /**
         * 클래스 토글
         */
        toggleClass(className, state) {
            this.elements.forEach(el => {
                className.split(' ').forEach(cls => {
                    if (cls) {
                        if (state === undefined) {
                            el.classList.toggle(cls);
                        } else if (state) {
                            el.classList.add(cls);
                        } else {
                            el.classList.remove(cls);
                        }
                    }
                });
            });
            return this;
        }

        /**
         * 클래스 포함 여부
         */
        hasClass(className) {
            return this.elements.some(el => el.classList.contains(className));
        }

        // ==========================================
        // 스타일 조작 메서드
        // ==========================================

        /**
         * CSS 설정/조회
         */
        css(prop, value) {
            if (typeof prop === 'string' && value === undefined) {
                return this.elements.length > 0 ?
                    window.getComputedStyle(this.elements[0])[prop] : undefined;
            }

            if (typeof prop === 'string') {
                this.elements.forEach(el => {
                    el.style[prop] = value;
                });
            } else if (typeof prop === 'object') {
                this.elements.forEach(el => {
                    Object.assign(el.style, prop);
                });
            }
            return this;
        }

        /**
         * 높이 설정/조회
         */
        height(value) {
            if (value === undefined) {
                return this.elements.length > 0 ? this.elements[0].offsetHeight : undefined;
            }
            this.elements.forEach(el => {
                el.style.height = typeof value === 'number' ? value + 'px' : value;
            });
            return this;
        }

        /**
         * 너비 설정/조회
         */
        width(value) {
            if (value === undefined) {
                return this.elements.length > 0 ? this.elements[0].offsetWidth : undefined;
            }
            this.elements.forEach(el => {
                el.style.width = typeof value === 'number' ? value + 'px' : value;
            });
            return this;
        }

        // ==========================================
        // 이벤트 메서드
        // ==========================================

        /**
         * 이벤트 등록
         */
        on(events, selector, handler) {
            // $(el).on('event', callback)
            if (typeof selector === 'function') {
                handler = selector;
                selector = null;
            }

            events.split(' ').forEach(event => {
                this.elements.forEach(el => {
                    if (selector) {
                        // 이벤트 위임
                        el.addEventListener(event, (e) => {
                            if (e.target.matches(selector)) {
                                handler.call(e.target, e);
                            }
                        });
                    } else {
                        // 직접 이벤트
                        el.addEventListener(event, (e) => {
                            handler.call(el, e);
                        });
                    }
                });
            });
            return this;
        }

        /**
         * 이벤트 제거
         */
        off(event, handler) {
            this.elements.forEach(el => {
                if (handler) {
                    el.removeEventListener(event, handler);
                } else {
                    // 모든 이벤트 제거 (복제로 해결)
                    const newEl = el.cloneNode(true);
                    el.parentNode?.replaceChild(newEl, el);
                }
            });
            return this;
        }

        /**
         * 클릭 이벤트
         */
        click(handler) {
            if (handler === undefined) {
                this.elements.forEach(el => el.click());
            } else {
                this.on('click', handler);
            }
            return this;
        }

        /**
         * 마우스 진입
         */
        mouseenter(handler) {
            return this.on('mouseenter', handler);
        }

        /**
         * 마우스 이탈
         */
        mouseleave(handler) {
            return this.on('mouseleave', handler);
        }

        /**
         * 포커스
         */
        focus(handler) {
            if (handler === undefined) {
                if (this.elements.length > 0) {
                    this.elements[0].focus();
                }
            } else {
                this.on('focus', handler);
            }
            return this;
        }

        /**
         * 블러
         */
        blur(handler) {
            if (handler === undefined) {
                if (this.elements.length > 0) {
                    this.elements[0].blur();
                }
            } else {
                this.on('blur', handler);
            }
            return this;
        }

        // ==========================================
        // 순회 메서드
        // ==========================================

        /**
         * 각 요소에 대해 함수 실행
         */
        each(callback) {
            this.elements.forEach((el, index) => {
                callback.call(el, index, el);
            });
            return this;
        }

        /**
         * 필터링
         */
        filter(selector) {
            const filtered = this.elements.filter(el => {
                return el.matches(selector);
            });
            return new JQueryCompat(filtered);
        }

        /**
         * 부모 요소 선택
         */
        parent(selector) {
            const parents = [];
            this.elements.forEach(el => {
                let parent = el.parentElement;
                if (!selector || parent?.matches(selector)) {
                    if (parent && !parents.includes(parent)) {
                        parents.push(parent);
                    }
                }
            });
            return new JQueryCompat(parents);
        }

        /**
         * 자식 요소 선택
         */
        children(selector) {
            const children = [];
            this.elements.forEach(el => {
                Array.from(el.children).forEach(child => {
                    if (!selector || child.matches(selector)) {
                        if (!children.includes(child)) {
                            children.push(child);
                        }
                    }
                });
            });
            return new JQueryCompat(children);
        }

        /**
         * 다음 요소 선택
         */
        next(selector) {
            const nexts = [];
            this.elements.forEach(el => {
                let next = el.nextElementSibling;
                if (next && (!selector || next.matches(selector))) {
                    if (!nexts.includes(next)) {
                        nexts.push(next);
                    }
                }
            });
            return new JQueryCompat(nexts);
        }

        /**
         * 이전 요소 선택
         */
        prev(selector) {
            const prevs = [];
            this.elements.forEach(el => {
                let prev = el.previousElementSibling;
                if (prev && (!selector || prev.matches(selector))) {
                    if (!prevs.includes(prev)) {
                        prevs.push(prev);
                    }
                }
            });
            return new JQueryCompat(prevs);
        }

        /**
         * 찾기
         */
        find(selector) {
            const found = [];
            this.elements.forEach(el => {
                Array.from(el.querySelectorAll(selector)).forEach(child => {
                    if (!found.includes(child)) {
                        found.push(child);
                    }
                });
            });
            return new JQueryCompat(found);
        }

        // ==========================================
        // 유틸리티 메서드
        // ==========================================

        /**
         * 길이
         */
        get length() {
            return this.elements.length;
        }

        /**
         * 인덱스로 접근
         */
        get(index) {
            return this.elements[index];
        }

        /**
         * 첫 번째 요소
         */
        first() {
            return new JQueryCompat(this.elements.length > 0 ? [this.elements[0]] : []);
        }

        /**
         * 마지막 요소
         */
        last() {
            return new JQueryCompat(this.elements.length > 0 ? [this.elements[this.elements.length - 1]] : []);
        }

        /**
         * eq (특정 인덱스)
         */
        eq(index) {
            if (index < 0) index = this.elements.length + index;
            return new JQueryCompat(this.elements[index] ? [this.elements[index]] : []);
        }

        /**
         * 표시 (display: block)
         */
        show() {
            this.elements.forEach(el => {
                el.style.display = '';
            });
            return this;
        }

        /**
         * 숨기기 (display: none)
         */
        hide() {
            this.elements.forEach(el => {
                el.style.display = 'none';
            });
            return this;
        }

        /**
         * 토글
         */
        toggle(state) {
            this.elements.forEach(el => {
                if (state === undefined) {
                    el.style.display = el.style.display === 'none' ? '' : 'none';
                } else if (state) {
                    el.style.display = '';
                } else {
                    el.style.display = 'none';
                }
            });
            return this;
        }

        /**
         * AJAX (기본 fetch 기반)
         */
        static ajax(options) {
            const {
                url,
                type = 'GET',
                data = null,
                success = null,
                error = null,
                complete = null,
                dataType = 'json',
                headers = {}
            } = options;

            const config = {
                method: type.toUpperCase(),
                headers: {
                    'Content-Type': 'application/json',
                    ...headers
                }
            };

            if (data && type.toUpperCase() !== 'GET') {
                config.body = typeof data === 'string' ? data : JSON.stringify(data);
            }

            fetch(url, config)
                .then(response => {
                    if (!response.ok) throw new Error(response.statusText);
                    return dataType === 'json' ? response.json() : response.text();
                })
                .then(data => {
                    if (success) success(data);
                })
                .catch(err => {
                    if (error) error(err);
                })
                .finally(() => {
                    if (complete) complete();
                });
        }
    }

    // ==========================================
    // 전역 $ 함수 정의
    // ==========================================

    function $(selector) {
        return new JQueryCompat(selector);
    }

    // jQuery 호환 메서드 추가
    $.ajax = JQueryCompat.ajax;
    $.each = function(obj, callback) {
        if (Array.isArray(obj)) {
            obj.forEach((item, index) => callback(index, item));
        } else if (typeof obj === 'object') {
            Object.entries(obj).forEach(([key, value]) => callback(key, value));
        }
    };
    $.extend = function(target, ...sources) {
        sources.forEach(source => {
            Object.assign(target, source);
        });
        return target;
    };
    $.isArray = Array.isArray;
    $.isPlainObject = function(obj) {
        return obj && typeof obj === 'object' && obj.constructor === Object;
    };
    $.trim = function(str) {
        return str.trim();
    };

    // ==========================================
    // Document Ready 구현
    // ==========================================

    $.ready = function(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    };

    // jQuery 호환: $(document).ready()
    JQueryCompat.prototype.ready = function(callback) {
        $.ready(callback);
        return this;
    };

    // ==========================================
    // 전역 객체에 등록
    // ==========================================

    window.$ = $;
    window.jQuery = $;

    // CommonJS / AMD 지원 (선택사항)
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = $;
    }

})(window);
