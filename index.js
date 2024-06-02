import express from 'express';
import mongoose from './db/dbconnection.js';
import Alert from './db/alertschema.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/dashboard', async (req, res) => {
  try {
    const totalAlerts = await Alert.countDocuments({});
    const uniqueSourceIPs = await Alert.distinct('src_ip').then(
      result => result.length
    );
    const uniqueDestinationPorts = await Alert.distinct('dest_port').then(
      result => result.length
    );

    const topSourceIPs = await Alert.aggregate([
      {
        $group: {
          _id: '$src_ip',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const topDestinationPorts = await Alert.aggregate([
      {
        $group: {
          _id: '$dest_port',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
 

    const severityDistribution = await Alert.aggregate([
      {
        $group: {
          _id: '$alert.severity',
          count: { $sum: 1 },
        },
      },
    ]);
    const categoryDistribution = await Alert.aggregate([
      {
        $group: {
          _id: '$alert.category',
          count: { $sum: 1 },
        },
      },
    ]);

    const alertsBySourceIP = await Alert.aggregate([
        {
          $group: {
            _id: '$src_ip',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } }
      ]);

    const alertDetails = await Alert.find(
      {},
      {
        timestamp: 1,
        src_ip: 1,
        src_port: 1,
        dest_ip: 1,
        dest_port: 1,
        'alert.signature': 1,
        'alert.category': 1,
      }
    ).limit(100);

    res.json({
      totalAlerts,
      uniqueSourceIPs,
      uniqueDestinationPorts,
      categoryDistribution,
      topSourceIPs,
      topDestinationPorts,
      severityDistribution,
      alertDetails,
      alertsBySourceIP
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

app.listen(process.env.PORT, () => {
  console.log('Server is running ');
});
