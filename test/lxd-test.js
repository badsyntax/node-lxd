'use strict';

var expect = require('chai').expect;
var config = process.env;
var client = null;
var fs = require('fs');
var lxd = require('../');

var container = 'lxd-test-' + new Date().getTime();
var image = 'lxd-image-' + new Date().getTime();
var createdImageFingerprint = null;

describe('Main LXD Api endpoints', function() {

  beforeEach(function() {
    client = new lxd.LXD({
      uri: config.LXD_URI,
      client: {
        strictSSL: false,
        agentOptions: {
          cert: fs.readFileSync(config.LXD_CERT),
          key: fs.readFileSync(config.LXD_KEY)
        }
      }
    });
  });

  describe('Server info', function() {

    it('Should return available APIs', function() {
      return client.getApis().then(function(res) {
        expect(res.status_code).to.be.equal(200);
        expect(res.metadata).to.contain('/1.0');
      });
    });

    it('Should return server info', function() {
      return client.getServerInfo().then(function(res) {
        expect(res.status_code).to.be.equal(200);
        expect(res.metadata.environment.driver).to.be.equal('lxc');
      });
    });

    it('Should update server info', function() {
      return client.updateServerInfo({
        config: {
          'core.trust_password': ''
        }
      }).then(function(res) {
        expect(res.status_code).to.be.equal(200);
      });
    });

  });

  describe('Images', function() {


    it('Should create a local image from a remote image', function() {
      return client.createImage({
        'public': false,
        source: {
          type: 'image',
          mode: 'pull',
          server: 'https://images.linuxcontainers.org',
          alias: 'ubuntu/trusty/amd64'
        }
      }).then(function(res) {
        expect(res.status).to.be.equal('OK');
        return client.waitOperation(res);
      }).then(function(operation) {
        var metadata = JSON.parse(operation).metadata;
        expect(metadata.status_code).to.be.equal(200);
        createdImageFingerprint = metadata.metadata.fingerprint;
      });
    });

    // /* Not implemented in LXD REST API */
    // it('Should rename an image', function() {
    //   return client.renameImage(createdImageFingerprint, {
    //     'name': 'foo',
    //   }).then(function(res) {
    //     console.log(res);
    //     expect(res.status).to.be.equal('OK');
    //     return client.waitOperation(res);
    //   }).then(function(operation) {
    //     var metadata = JSON.parse(operation).metadata;
    //     expect(metadata.status_code).to.be.equal(200);
    //     console.log(metadata);
    //   });
    // });
    //

    it('Should list images', function() {
      return client.getImages().then(function(res) {
        expect(res.status_code).to.be.equal(200);
        expect(Boolean(res.metadata.length)).to.be.equal(true);
      });
    });

    it('Should get an image\'s info', function() {
    });

    describe('Aliases', function() {

      it('Should create an image alias', function() {
        var json = {
          description: 'The alias description',
          target: createdImageFingerprint,
          name: image
        }
        return client.createImageAlias(json).then(function(res) {
          expect(res.status_code).to.be.equal(200, res);
        });
      });

      it('Should list image aliases', function() {
        return client.getImageAliases().then(function(res) {
          expect(res.status_code).to.be.equal(200);
          expect(res.metadata).to.contain('/1.0/images/aliases/' + image);
        });
      });
    });
  });

  describe('Profiles', function() {
    it('Should list profiles', function() {
      return client.getProfiles().then(function(res) {
        expect(res.status_code).to.be.equal(200);
        expect(Boolean(res.metadata.length)).to.be.equal(true);
      });
    })
  });

  describe('Container manipulation', function() {

    it('Should create a container', function() {
      return client.createContainer({
        name: container,
        profiles: ['default'],
        source: {
          type: 'image',
          alias: image
        }
      }).then(function(res) {
        expect(res.status).to.be.equal('OK');

        return client.waitOperation(res);
      });
    });

    it('Should list containers', function() {
      return client.getContainers().then(function(res) {
        expect(res.status_code).to.be.equal(200);
        expect(res.metadata).to.contain('/1.0/containers/' + container);
      });
    });

    it('Should get a container\'s infos', function() {
      return client.getContainer(container).then(function(res) {
        expect(res.status_code).to.be.equal(200);
        expect(res.metadata.name).to.be.equal(container);
      });
    });

    it('Should update a container', function() {
      return client.updateContainer(container, {
        config: {
          'resources.cpus': '1'
        }
      }).then(function(res) {
        expect(res.status).to.be.equal('OK');

        return client.waitOperation(res);
      });
    });

    it('Should rename a container', function() {
      return client.renameContainer(container, {
        name: container + '-new'
      }).then(function(res) {
        expect(res.status).to.be.equal('OK');

        return client.waitOperation(res);
      });
    });

    it('Should delete a container', function() {
      return client.deleteContainer(container + '-new').then(function(res) {
        expect(res.status).to.be.equal('OK');

        return client.waitOperation(res);
      });
    });

  });

  describe('Image deletion', function() {
    it('Should delete an image', function() {
      return client.deleteImage(createdImageFingerprint)
      .then(function(res) {
        expect(res.status_code).to.be.equal(200);
      });
    });
  });

});
