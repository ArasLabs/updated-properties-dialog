# Improved Property Dialog

This project makes some small improvements to the properties dialog, which is available with every item within Innovator. The ability to quickly view the ID of an item was removed and replaced with the 'Copy ID' button. A hover action has been added to that button to quickly preview the GUID.

Additionally, there is a new button on the properties dialog, which generates a QR Code which links directly to the selected item. From here you can copy or download the generated QR Code to use however you see fit. You are able to right click to copy to clipboard or save the image to your client machine. To generate QR Codes we utilize a third party library called QRCode.js, and can be found [here](https://davidshimjs.github.io/qrcodejs/). 


## History

Release | Notes
--------|--------
[v1.0](https://github.com/ArasLabs/update-properties-dialog/releases/tag/v1.0) | Initial Release

#### Supported Aras Versions

Project | Aras
--------|------
[v1.0](https://github.com/ArasLabs/update-properties-dialog/releases/tag/v1.0) | 11.0 SP15, 12.0 Beta

## Installation

#### Important!
**Always back up your code tree and database before applying an import package or code tree patch!**

### Pre-requisites

1. Aras Innovator installed

### Install Steps

1. Backup your code tree.
2. Copy the Innovator folder provided in this repository into the root folder of your aras installation.
3. Open `client/javascript/IncludeNamespaceConfig.xml`
4. Place the line `<file src="qrcode.js"/>` within the `<ArasModules>` tag.

## Usage

1. Open the properties dialog for any item.
2. Hover over the `Copy ID` button to see the exposed GUID of that item.
3. Show the QR code which links directly to that item.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

For more information on contributing to this project, another Aras Labs project, or any Aras Community project, shoot us an email at araslabs@aras.com.

## Credits

Created by AJ Sebastian, Aras Labs.

## License

Aras Labs projects are published to Github under the MIT license. See the [LICENSE file](./LICENSE.md) for license rights and limitations.
