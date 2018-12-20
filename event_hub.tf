resource "azurerm_resource_group" "test" {
  name     = "cf-nozzle-eh"
  location = "West Europe"
}

resource "azurerm_eventhub_namespace" "test" {
  name                = "loggregator"
  location            = "${azurerm_resource_group.test.location}"
  resource_group_name = "${azurerm_resource_group.test.name}"
  sku                 = "Basic"
  capacity            = 1
}

resource "azurerm_eventhub" "test" {
  name                = "firehose"
  namespace_name      = "${azurerm_eventhub_namespace.test.name}"
  resource_group_name = "${azurerm_resource_group.test.name}"
  partition_count     = 3
  message_retention   = 1
}

resource "azurerm_eventhub_authorization_rule" "test" {
  name                = "nozzle"
  namespace_name      = "${azurerm_eventhub_namespace.test.name}"
  eventhub_name       = "${azurerm_eventhub.test.name}"
  resource_group_name = "${azurerm_resource_group.test.name}"
  listen              = false
  send                = true
  manage              = false
}

resource "azurerm_storage_account" "test" {
  name                     = "cfnozzlesa"
  resource_group_name      = "${azurerm_resource_group.test.name}"
  location                 = "${azurerm_resource_group.test.location}"
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

output "eventhub_primary_key" {
  value = "${azurerm_eventhub_authorization_rule.test.primary_connection_string}"
}

output "storage_primary_key" {
  value = "${azurerm_storage_account.test.primary_connection_string}"
}
