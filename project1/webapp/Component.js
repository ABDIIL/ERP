sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
  ], function (UIComponent, JSONModel, Device) {
    "use strict";
  
    return UIComponent.extend("movementsapplication.Component", {
      metadata: {
        manifest: "json"
      },
  
      /**
       * Called when the component is initialized.
       * @public
       * @override
       */
      init: function () {
        // roep eerst de init van de parent aan (leest manifest.json in, maakt models)
        UIComponent.prototype.init.apply(this, arguments);
  
        // Device-model om responsive gedrag mogelijk te maken
        var oDeviceModel = new JSONModel(Device);
        oDeviceModel.setDefaultBindingMode("OneWay");
        this.setModel(oDeviceModel, "device");
  
        // router initialiseren (gebaseerd op routing-config in manifest.json)
        this.getRouter().initialize();
      }
    });
  });
  