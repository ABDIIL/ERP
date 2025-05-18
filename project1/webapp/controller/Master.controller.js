sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
  ], function (Controller, Filter, FilterOperator) {
    "use strict";
  
    return Controller.extend("movementsapplication.controller.Master", {
      /**
       * Called when the controller is instantiated.
       */
      onInit: function () {
        // Sla referenties op voor de lijst en de router
        this._oList = this.byId("movementList");
        this._oRouter = this.getOwnerComponent().getRouter();
      },
  
      /**
       * Gebruiker past filter aan (type of datum): pas binding op de list toe.
       */
      onFilterChange: function () {
        var aFilters = [];
        var sType = this.byId("typeFilter").getSelectedKey();
        var oDate = this.byId("dateFilter").getDateValue();
  
        if (sType) {
          aFilters.push(new Filter("MovementType", FilterOperator.EQ, sType));
        }
        if (oDate) {
          aFilters.push(new Filter("MovementDate", FilterOperator.EQ, oDate));
        }
  
        this._oList.getBinding("items").filter(aFilters);
      },
  
      /**
       * Gebruiker selecteert een item: navigeer naar Detail-route met MovementID
       */
      onSelect: function (oEvent) {
        var oItem = oEvent.getParameter("listItem");
        var sMovementID = oItem.getBindingContext().getProperty("MovementID");
  
        this._oRouter.navTo("Detail", {
          MovementID: sMovementID
        });
      },
  
      /**
       * Gebruiker klikt op Create: navigeer naar Detail zonder ID (create-modus)
       */
      onCreate: function () {
        this._oRouter.navTo("Detail", {});
      }
    });
  });
  