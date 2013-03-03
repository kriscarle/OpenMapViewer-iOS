// inspired by: https://github.com/coomsie/topomap.co.nz/blob/master/Resources/leaflet/TileLayer.DB.js
L.TileLayer.MBTiles = L.TileLayer.extend({
	//db: SQLitePlugin
	mbTilesDB: null,

	initialize: function(url, options, db) {

		this.mbTilesDB = db;

		L.Util.setOptions(this, options);
	},
	getTileUrl: function (tilePoint, zoom, tile) {
        
		var z = this._getOffsetZoom(zoom);
		var x = tilePoint.x;
		var y = tilePoint.y;
		var base64Prefix = 'data:image/gif;base64,';
                                                                                
        this.mbTilesDB.transaction(function(tx) {
            tx.executeSql("SELECT tile_data FROM images INNER JOIN map ON images.tile_id = map.tile_id WHERE zoom_level = ? AND tile_column = ? AND tile_row = ?", [z, x, y],
                          function (tx, res) {
                          
                          
                          if(res && res.rows && res.rows.length > 0){
                          
                            tile.src = base64Prefix + res.rows.item(0).tile_data;
                            
                          }else{
                            console.log('no tile found');
                          }

                          }, function (e) {
                              console.log('error with executeSql', e);
                          }
            );

        });
                                         
	},
	_loadTile: function (tile, tilePoint, zoom) {                                
		tile._layer = this;
		tile.onload = this._tileOnLoad;
		tile.onerror = this._tileOnError;
		this.getTileUrl(tilePoint, zoom, tile);
	}
});