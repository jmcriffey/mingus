import chai from 'chai';
import React from 'react';

import {
    getHooks,
    clearSpies,
    clearStubs,
    initTests,
    spy,
    stub,
    throwAssertionError
} from './helpers';


export class TestCase {
    constructor(name={}, config={}) {
        this.spies = [];
        this.stubs = [];
        this.name = name;
        this.config = config;
        this.hooks = getHooks(this);
    }

    //assertion methods
    assertDeepEqual(...args) {
        chai.assert.deepEqual(...args);
    }

    assertEqual(...args) {
        chai.assert.equal(...args);
    }

    assertTrue(...args) {
        chai.assert.isTrue(...args);
    }

    assertFalse(...args) {
        chai.assert.isFalse(...args);
    }

    assertNotNull(...args) {
        chai.assert.isNotNull(...args);
    }

    assertNull(...args) {
        chai.assert.isNull(...args);
    }

    assertTypeOf(...args) {
        chai.assert.typeOf(...args);
    }

    assertUndefined(...args) {
        chai.assert.isUndefined(...args);
    }

    assertInstanceOf(...args) {
        chai.assert.instanceOf(...args);
    }

    assertNotInstanceOf(...args) {
        chai.assert.notInstanceOf(...args);
    }

    assertHasClass(component, cls) {
        throwAssertionError(
            !this.hasClass(component, cls),
            `expected component to have class '${cls}'`
        );
    }

    assertIsType(component, type) {
        throwAssertionError(
            !this.isType(component, type),
            `expected component to be type '${type}'`
        );
    }

    assertEveryChildHasClass(component, cls) {
        const everyChildHasClass = this.getChildren(component).every(
            (child) => this.hasClass(child, cls)
        );

        throwAssertionError(
            !everyChildHasClass,
            `expected every child to have class '${cls}'`
        );
    }

    assertEveryChildIsType(component, type) {
        const everyChildIsType = this.getChildren(component).every(
            (child) => this.isType(child, type)
        );

        throwAssertionError(
            !everyChildIsType,
            `expected every child to be type '${type}'`
        );
    }

    assertNthChildHasClass(component, n, cls) {
        const child = this.getChildren(component)[n];

        throwAssertionError(
            !this.hasClass(child, cls),
            `expected child ${n} to have class '${cls}'`
        );
    }

    assertNthChildIsType(component, n, type) {
        const child = this.getChildren(component)[n];

        throwAssertionError(
            !this.isType(child, type),
            `expected child ${n} to be type '${type}'`
        );
    }

    assertNumChildren(component, num) {
        const numChildren = this.getChildren(component).length;

        throwAssertionError(
            numChildren !== num,
            `expected component with ${numChildren} ` +
            `children to have ${num} children`
        );
    }

    assertNumChildrenOfType(component, num, type) {
        const numChildrenOfType = this.getChildren(component).filter(
            (child) => this.isType(child, type)
        ).length;

        throwAssertionError(
            numChildrenOfType !== num,
            `expected component with ${numChildrenOfType} children ` +
            `of type '${type}' ` +
            `to have ${num} children of type '${type}'`
        );
    }

    assertNumChildrenWithClass(component, num, cls) {
        const numChildrenWithClass = this.getChildren(component).filter(
            (child) => this.hasClass(child, cls)
        ).length;

        throwAssertionError(
            numChildrenWithClass !== num,
            `expected component with ${numChildrenWithClass} children ` +
            `with class '${cls}' ` +
            `to have ${num} children with class '${cls}'`
        );
    }

    assertSomeChildHasClass(component, cls) {
        const someChildHasClass = this.getChildren(component).some(
            (child) => this.hasClass(child, cls)
        );

        throwAssertionError(
            !someChildHasClass,
            `expected component to have some child with class '${cls}'`
        );
    }

    assertSomeChildIsType(component, type) {
        const someChildIsType = this.getChildren(component).some(
            (child) => this.isType(child, type)
        );

        throwAssertionError(
            !someChildIsType,
            `expected component to have some child of type '${type}'`
        );
    }

    assertText(component, text) {
        throwAssertionError(
            component.props.children !== text,
            `expected component to have text '${text}'`
        );
    }

    //mocha hooks
    after() {
        this.hooks.after();
    }

    afterEach() {
        this.hooks.afterEach();
        clearSpies(this);
        clearStubs(this);
    }

    before() {
        this.hooks.before();
    }

    beforeEach() {
        this.hooks.beforeEach();
    }

    //react helpers
    createComponent(component, props) {
        const Component = component;
        const cls = (
            Component.type ?
            Component :
            React.createElement(Component, props)
        );

        return new cls.type(
            cls.props,
            cls._context //eslint-disable-line
        );
    }

    getChildren(component) {
        const children = component.props.children;

        if (children && children.length) {
            return children;
        }

        if (children && !children.length) {
            return [children];
        }

        return [];
    }

    hasClass(component, cls) {
        return component.props.className.split(' ').indexOf(cls) >= 0;
    }

    isType(component, type) {
        return component.type === type;
    }

    renderComponent(...args) {
        return this.createComponent(...args).render();
    }

    //mock helpers
    spy(...args) {
        return spy(this, ...args);
    }

    stub(...args) {
        return stub(this, ...args);
    }
}

export default {
    createTestCase(name, config) {
        initTests(new TestCase(name, config));
    }
};
