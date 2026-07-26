using QRCoder;
using System;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Windows.Forms;

namespace WindowsFormsApp1
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void btnTaoQR_Click(object sender, EventArgs e)
        {
            QRCodeGenerator generator = new QRCodeGenerator();
            QRCodeData data = generator.CreateQrCode(txtNoiDung.Text, QRCodeGenerator.ECCLevel.Q);
            QRCode qrCode = new QRCode(data);
            pictureBox1.Image = qrCode.GetGraphic(20);
        }
    }
}
