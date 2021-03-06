/*global ZeroClipboard, _clipData, flashState */

"use strict";

(function(module, test) {

  // Helper functions
  var TestUtils = {
    getHtmlBridge: function() {
      return document.getElementById("global-zeroclipboard-html-bridge");
    }
  };

  var originalFlashDetect;

  module("client", {
    setup: function() {
      // Store
      originalFlashDetect = ZeroClipboard.isFlashUnusable;
      // Modify
      ZeroClipboard.isFlashUnusable = function() {
        return false;
      };
    },
    teardown: function() {
      // Restore
      ZeroClipboard.isFlashUnusable = originalFlashDetect;
      ZeroClipboard.destroy();
    }
  });

  test("Client is created properly", function(assert) {
    assert.expect(2);

    // Arrange & Act
    var client = new ZeroClipboard();

    // Assert
    assert.ok(client);
    assert.ok(client.id);
  });

  test("Client without selector doesn't have elements", function(assert) {
    assert.expect(2);

    // Arrange & Act
    var client = new ZeroClipboard();

    // Assert
    assert.ok(client);
    assert.deepEqual(client.elements(), []);
  });

  test("setText overrides the data-clipboard-text attribute", function(assert) {
    assert.expect(1);

    // Arrange
    var client = new ZeroClipboard();
    var currentEl = document.getElementById("d_clip_button");

    // Act
    client.clip(currentEl);
    client.setText("This is the new text");
    ZeroClipboard.activate(currentEl);

    // Assert
    assert.strictEqual(_clipData["text/plain"], "This is the new text");
  });

  test("Object has a title", function(assert) {
    assert.expect(1);

    // Arrange
    var client = new ZeroClipboard();
    var currentEl = document.getElementById("d_clip_button");

    // Act
    client.clip(currentEl);
    ZeroClipboard.activate(currentEl);

    // Assert
    assert.strictEqual(TestUtils.getHtmlBridge().getAttribute("title"), "Click me to copy to clipboard.");

    // Revert
    ZeroClipboard.deactivate();
  });

  test("Object has no title", function(assert) {
    assert.expect(1);

    // Arrange
    var client = new ZeroClipboard();
    var currentEl = document.getElementById("d_clip_button_no_title");

    // Act
    client.clip(currentEl);
    ZeroClipboard.activate(currentEl);

    // Assert
    assert.ok(!TestUtils.getHtmlBridge().getAttribute("title"));
  });

  test("Object has data-clipboard-text", function(assert) {
    assert.expect(2);

    // Arrange
    var client = new ZeroClipboard();
    var currentEl = document.getElementById("d_clip_button");

    // Act
    client.clip(currentEl);
    ZeroClipboard.activate(currentEl);
    var pendingText = ZeroClipboard.emit("copy");

    // Assert
    assert.strictEqual(_clipData["text/plain"], "Copy me!");
    assert.deepEqual(pendingText, _clipData["text/plain"]);

    // Revert
    ZeroClipboard.deactivate();
  });

  test("Object has data-clipboard-target textarea", function(assert) {
    assert.expect(2);

    // Arrange
    var client = new ZeroClipboard();
    var currentEl = document.getElementById("d_clip_button_textarea_text");

    // Act
    client.clip(currentEl);
    ZeroClipboard.activate(currentEl);
    var pendingText = ZeroClipboard.emit("copy");

    // Assert
    assert.strictEqual(_clipData["text/plain"].replace(/\r\n/g, '\n'),
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\n"+
      "tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,\n"+
      "quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo\n"+
      "consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse\n"+
      "cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non\n"+
      "proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    );
    assert.deepEqual(pendingText, _clipData["text/plain"]);

    // Revert
    ZeroClipboard.deactivate();
  });

  test("Object has data-clipboard-target pre", function(assert) {
    assert.expect(2);

    // Arrange
    var client = new ZeroClipboard();
    var currentEl = document.getElementById("d_clip_button_pre_text");

    // Act
    client.clip(currentEl);
    ZeroClipboard.activate(currentEl);
    var pendingText = ZeroClipboard.emit("copy");

    // Assert
    assert.strictEqual(_clipData["text/plain"].replace(/\r\n/g, '\n'),
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\n"+
      "tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,\n"+
      "quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo\n"+
      "consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse\n"+
      "cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non\n"+
      "proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    );
    assert.deepEqual(pendingText, _clipData["text/plain"]);

    // Revert
    ZeroClipboard.deactivate();
  });

  test("Object has data-clipboard-target input", function(assert) {
    assert.expect(2);

    // Arrange
    var client = new ZeroClipboard();
    var currentEl = document.getElementById("d_clip_button_input_text");

    // Act
    client.clip(currentEl);
    ZeroClipboard.activate(currentEl);
    var pendingText = ZeroClipboard.emit("copy");

    // Assert
    assert.strictEqual(_clipData["text/plain"], "Clipboard Text");
    assert.deepEqual(pendingText, _clipData["text/plain"]);

    // Revert
    ZeroClipboard.deactivate();
  });

  test("Object doesn't have data-clipboard-text", function(assert) {
    assert.expect(1);

    // Arrange
    var client = new ZeroClipboard();
    var currentEl = document.getElementById("d_clip_button_no_text");

    // Act
    client.clip(currentEl);
    ZeroClipboard.activate(currentEl);

    // Assert
    assert.ok(!TestUtils.getHtmlBridge().getAttribute("data-clipboard-text"));
  });

  test("New client is not the same client (no singleton) but does share the same bridge", function(assert) {
    assert.expect(6);

    // Assert, arrange, assert, act, assert
    assert.strictEqual($(".global-zeroclipboard-container").length, 0);
    var client1 = new ZeroClipboard();
    assert.ok(client1.id);
    assert.strictEqual($(".global-zeroclipboard-container").length, 1);
    var client2 = new ZeroClipboard();
    assert.strictEqual($(".global-zeroclipboard-container").length, 1);
    assert.notEqual(client2.id, client1.id);
    assert.notEqual(client2, client1);
  });

  test("Calculations based on borderWidth never return NaN", function(assert) {
    assert.expect(4);

    // Arrange
    var client = new ZeroClipboard();
    var currentEl = document.getElementById("d_clip_button");

    // Act
    client.clip(currentEl);
    ZeroClipboard.activate(currentEl);

    // Assert
    assert.strictEqual(/^-?[0-9\.]+px$/.test(TestUtils.getHtmlBridge().style.top), true);
    assert.strictEqual(/^-?[0-9\.]+px$/.test(TestUtils.getHtmlBridge().style.left), true);
    assert.strictEqual(/^-?[0-9\.]+px$/.test(TestUtils.getHtmlBridge().style.width), true);
    assert.strictEqual(/^-?[0-9\.]+px$/.test(TestUtils.getHtmlBridge().style.height), true);
  });

  test("No more client singleton!", function(assert) {
    assert.expect(7);

    // Arrange
    ZeroClipboard.isFlashUnusable = function() {
      return false;
    };

    // Assert, arrange, assert, act, assert
    assert.ok(!ZeroClipboard.prototype._singleton, "The client singleton does not exist on the prototype before creating a client");
    var client1 = new ZeroClipboard();
    assert.ok(!ZeroClipboard.prototype._singleton, "The client singleton does not exist on the prototype after creating a client");
    assert.ok(!client1._singleton, "The client singleton does not exist on the client instance after creating a client");
    var client2 = new ZeroClipboard();
    assert.ok(!ZeroClipboard.prototype._singleton, "The client singleton does not exist on the prototype after creating a second client");
    assert.ok(!client1._singleton, "The client singleton does not exist on the first client instance after creating a second client");
    assert.ok(!client2._singleton, "The client singleton does not exist on the second client instance after creating a second client");
    ZeroClipboard.destroy();
    assert.ok(!ZeroClipboard.prototype._singleton, "The client singleton does not exist on the prototype after calling `destroy`");
  });


  module("ZeroClipboard (built) - Core", {
    setup: function() {
      // Store
      originalFlashDetect = ZeroClipboard.isFlashUnusable;
      // Modify
      ZeroClipboard.isFlashUnusable = function() {
        return false;
      };
    },
    teardown: function() {
      // Restore
      ZeroClipboard.isFlashUnusable = originalFlashDetect;
      ZeroClipboard.destroy();
    }
  });

  test("`destroy` clears up the client", function(assert) {
    assert.expect(6);

    // Arrange
    ZeroClipboard.isFlashUnusable = function() {
      return false;
    };

    // Assert, arrange, assert, act, assert
    assert.ok(!ZeroClipboard.prototype._singleton, "The client singleton does not exist before creating a client");
    assert.equal(document.getElementById("global-zeroclipboard-html-bridge"), null, "The HTML bridge does not exist before creating a client");
    var client = new ZeroClipboard();
    assert.ok(!ZeroClipboard.prototype._singleton, "The client singleton does exist after creating a client");
    assert.notEqual(document.getElementById("global-zeroclipboard-html-bridge"), null, "The HTML bridge does exist after creating a client");
    ZeroClipboard.destroy();
    assert.ok(!ZeroClipboard.prototype._singleton, "The client singleton does not exist after calling `destroy`");
    assert.equal(document.getElementById("global-zeroclipboard-html-bridge"), null, "The HTML bridge does not exist after calling `destroy`");
  });


  module("dom", {
    setup: function() {
      // Store
      originalFlashDetect = ZeroClipboard.isFlashUnusable;
      // Modify
      ZeroClipboard.isFlashUnusable = function() {
        return false;
      };
    },
    teardown: function() {
      // Restore
      ZeroClipboard.isFlashUnusable = originalFlashDetect;
      ZeroClipboard.destroy();
    }
  });

  test("Bridge is ready after emitting `ready`", function(assert) {
    assert.expect(2);

    // Arrange
    ZeroClipboard.isFlashUnusable = function() {
      return false;
    };
    var client = new ZeroClipboard();

    // Assert, act, assert
    assert.strictEqual(flashState.ready, false);
    // `emit`-ing event handlers are async (generally) but the internal `ready` state is set synchronously
    ZeroClipboard.emit("ready");
    assert.strictEqual(flashState.ready, true);
  });

})(QUnit.module, QUnit.test);
