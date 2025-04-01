using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace WysiwgUmbracoCommunityExtensions.Models
{
    public class CropModel
    {

        [JsonProperty("alias")]
        public string Alias { get; set; } = "";

        [JsonProperty("height")]
        public int Height { get; set; }

        [JsonProperty("width")]
        public int Width { get; set; }

        [JsonProperty("coordinates")]
        public CropCoordinates? Coordinates { get; set; }
    }

    public class CropCoordinates
    {
        [JsonProperty("x1")]
        public double X1 { get; set; }

        [JsonProperty("x2")]
        public double X2 { get; set; }

        [JsonProperty("y1")]
        public double Y1 { get; set; }

        [JsonProperty("y2")]
        public double Y2 { get; set; }
    }
}
